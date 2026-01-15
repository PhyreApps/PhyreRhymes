package rhyme

import (
	"strings"
)

// EnhancedRhymeEngine provides improved rhyming capabilities
type EnhancedRhymeEngine struct {
	// Pre-computed rhyme keys for fast lookup
	rhymeKeys map[string]string
}

// NewEnhancedRhymeEngine creates a new enhanced rhyme engine
func NewEnhancedRhymeEngine() *EnhancedRhymeEngine {
	return &EnhancedRhymeEngine{
		rhymeKeys: make(map[string]string),
	}
}

// GetRhymeKey generates a normalized rhyme key for a word
// This can be used for fast database lookups
func GetRhymeKey(word string) string {
	word = strings.ToLower(strings.TrimSpace(word))
	if len(word) < 2 {
		return ""
	}

	// Extract last syllable(s) - typically 2-4 characters
	// For Bulgarian, rhymes usually match from the last stressed vowel
	lastSyllable := extractLastSyllable(word)
	
	// Normalize similar-sounding letters
	normalized := normalizeForRhyme(lastSyllable)
	
	return normalized
}

// extractLastSyllable extracts the rhyming part of a word
// In Bulgarian, this is typically from the last vowel to the end
func extractLastSyllable(word string) string {
	runes := []rune(word)
	vowels := vowelLetters()
	
	// Find last vowel position
	lastVowelPos := -1
	for i := len(runes) - 1; i >= 0; i-- {
		if contains(vowels, string(runes[i])) {
			lastVowelPos = i
			break
		}
	}
	
	// If no vowel found, return last 3 characters
	if lastVowelPos == -1 {
		if len(runes) >= 3 {
			return string(runes[len(runes)-3:])
		}
		return word
	}
	
	// Return from last vowel to end, but limit to reasonable length
	start := lastVowelPos
	if start > 0 && lastVowelPos < len(runes)-1 {
		// Include one consonant before vowel if exists
		start = lastVowelPos - 1
		if start < 0 {
			start = 0
		}
	}
	
	result := string(runes[start:])
	
	// Limit to max 5 characters for rhyme key
	if len([]rune(result)) > 5 {
		return string([]rune(result)[len([]rune(result))-5:])
	}
	
	return result
}

// normalizeForRhyme normalizes similar-sounding letters for rhyme matching
func normalizeForRhyme(word string) string {
	normalized := word
	similarMap := similarSoundingLetters()
	
	// Normalize to a canonical form
	for canonical, variants := range similarMap {
		for _, variant := range variants {
			normalized = strings.ReplaceAll(normalized, variant, canonical)
		}
	}
	
	return normalized
}

// GetEnhancedRhymeRate calculates rhyme rate using multiple methods
func GetEnhancedRhymeRate(word, withWord string) float64 {
	word = strings.ToLower(strings.TrimSpace(word))
	withWord = strings.ToLower(strings.TrimSpace(withWord))
	
	if len(word) < 2 || len(withWord) < 2 {
		return 0
	}
	
	if word == withWord {
		return 0
	}
	
	var totalScore float64
	
	// Method 1: Exact ending match (highest weight)
	score1 := scoreExactEnding(word, withWord)
	totalScore += score1 * 3.0 // Weight: 3x
	
	// Method 2: Syllable-based matching
	score2 := scoreSyllableMatch(word, withWord)
	totalScore += score2 * 2.5 // Weight: 2.5x
	
	// Method 3: Phonetic similarity (normalized endings)
	score3 := scorePhoneticMatch(word, withWord)
	totalScore += score3 * 2.0 // Weight: 2x
	
	// Method 4: Vowel pattern matching
	score4 := scoreVowelPattern(word, withWord)
	totalScore += score4 * 1.5 // Weight: 1.5x
	
	// Method 5: Similar-sounding letter matching
	score5 := scoreSimilarSounding(word, withWord)
	totalScore += score5 * 1.0 // Weight: 1x
	
	return totalScore
}

// scoreExactEnding scores based on exact ending matches
func scoreExactEnding(word, withWord string) float64 {
	var score float64
	
	// Check last 2, 3, 4, 5 characters
	for i := 2; i <= 5; i++ {
		wordEnd := getLastN(word, i)
		withWordEnd := getLastN(withWord, i)
		
		if wordEnd == withWordEnd {
			switch i {
			case 5:
				score = 2.0
			case 4:
				score = 1.5
			case 3:
				score = 1.0
			case 2:
				score = 0.5
			}
			break // Take the longest match
		}
	}
	
	return score
}

// scoreSyllableMatch scores based on syllable ending
func scoreSyllableMatch(word, withWord string) float64 {
	wordSyllable := extractLastSyllable(word)
	withWordSyllable := extractLastSyllable(withWord)
	
	if wordSyllable == withWordSyllable {
		return 2.0
	}
	
	// Check if normalized versions match
	wordNorm := normalizeForRhyme(wordSyllable)
	withWordNorm := normalizeForRhyme(withWordSyllable)
	
	if wordNorm == withWordNorm {
		return 1.5
	}
	
	// Partial match
	if len(wordSyllable) >= 3 && len(withWordSyllable) >= 3 {
		wordEnd := getLastN(wordSyllable, 3)
		withWordEnd := getLastN(withWordSyllable, 3)
		if wordEnd == withWordEnd {
			return 1.0
		}
	}
	
	return 0
}

// scorePhoneticMatch scores based on phonetic similarity
func scorePhoneticMatch(word, withWord string) float64 {
	wordKey := GetRhymeKey(word)
	withWordKey := GetRhymeKey(withWord)
	
	if wordKey == withWordKey {
		return 2.0
	}
	
	// Check similarity of keys
	if len(wordKey) >= 3 && len(withWordKey) >= 3 {
		wordKeyEnd := getLastN(wordKey, 3)
		withWordKeyEnd := getLastN(withWordKey, 3)
		if wordKeyEnd == withWordKeyEnd {
			return 1.0
		}
	}
	
	return 0
}

// scoreVowelPattern scores based on vowel patterns
func scoreVowelPattern(word, withWord string) float64 {
	wordVowels := getVowelLettersFromWord(word)
	withWordVowels := getVowelLettersFromWord(withWord)
	
	if len(wordVowels) == 0 || len(withWordVowels) == 0 {
		return 0
	}
	
	var score float64
	
	// Check last vowel match
	lastWordVowel := wordVowels[len(wordVowels)-1]
	lastWithWordVowel := withWordVowels[len(withWordVowels)-1]
	
	if lastWordVowel.Letter == lastWithWordVowel.Letter {
		// Same vowel in similar position
		posDiff := abs(lastWordVowel.Position - lastWithWordVowel.Position)
		if posDiff == 0 {
			score += 1.0
		} else if posDiff <= 1 {
			score += 0.5
		} else {
			score += 0.2
		}
	}
	
	// Check if vowel sequences match
	if len(wordVowels) >= 2 && len(withWordVowels) >= 2 {
		wordLastTwoVowels := wordVowels[len(wordVowels)-2:]
		withWordLastTwoVowels := withWordVowels[len(withWordVowels)-2:]
		
		matches := 0
		for i := 0; i < len(wordLastTwoVowels) && i < len(withWordLastTwoVowels); i++ {
			if wordLastTwoVowels[i].Letter == withWordLastTwoVowels[i].Letter {
				matches++
			}
		}
		
		if matches == 2 {
			score += 0.5
		} else if matches == 1 {
			score += 0.2
		}
	}
	
	return score
}

// scoreSimilarSounding scores based on similar-sounding letter replacements
func scoreSimilarSounding(word, withWord string) float64 {
	wordSimilar := getSimilarSounding(word)
	
	var maxScore float64
	
	for _, similar := range wordSimilar {
		// Check ending matches with similar-sounding variants
		for i := 2; i <= 4; i++ {
			similarEnd := getLastN(similar, i)
			withWordEnd := getLastN(withWord, i)
			
			if similarEnd == withWordEnd {
				switch i {
				case 4:
					if 1.0 > maxScore {
						maxScore = 1.0
					}
				case 3:
					if 0.5 > maxScore {
						maxScore = 0.5
					}
				case 2:
					if 0.2 > maxScore {
						maxScore = 0.2
					}
				}
			}
		}
	}
	
	return maxScore
}

// abs returns absolute value
func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

// IsVowel checks if a rune is a vowel
func IsVowel(r rune) bool {
	vowels := vowelLetters()
	for _, v := range vowels {
		if strings.ContainsRune(v, r) {
			return true
		}
	}
	return false
}

// CountSyllables estimates syllable count (simple heuristic)
func CountSyllables(word string) int {
	runes := []rune(strings.ToLower(word))
	vowelCount := 0
	prevWasVowel := false
	
	for _, r := range runes {
		isVowel := IsVowel(r)
		if isVowel && !prevWasVowel {
			vowelCount++
		}
		prevWasVowel = isVowel
	}
	
	// Bulgarian words typically have at least one syllable
	if vowelCount == 0 && len(runes) > 0 {
		return 1
	}
	
	return vowelCount
}
