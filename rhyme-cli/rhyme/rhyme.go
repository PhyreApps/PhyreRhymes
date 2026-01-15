package rhyme

import (
	"strings"
)

type RhymeResult struct {
	Word   string  `json:"word"`
	Rating float64 `json:"rating"`
}

// GetRhymeRate calculates the rhyme rate between two words
func GetRhymeRate(word, withWord string) float64 {
	word = strings.ToLower(word)
	withWord = strings.ToLower(withWord)

	if len(word) < 2 || len(withWord) < 2 {
		return 0
	}

	if word == withWord {
		return 0
	}

	var rhymeRate float64

	wordSimilar := getSimilarSounding(word)
	wordLastTwoLetters := getLastN(word, 2)
	wordLastFourLetters := getLastN(word, 4)
	wordLastThreeLetters := getLastN(word, 3)
	wordVowels := getVowelLettersFromWord(word)

	withWordLastTwoLetters := getLastN(withWord, 2)
	withWordLastFourLetters := getLastN(withWord, 4)
	withWordLastThreeLetters := getLastN(withWord, 3)
	withWordVowels := getVowelLettersFromWord(withWord)

	// Check vowel matches
	if len(wordVowels) > 0 && len(withWordVowels) > 0 {
		for _, vowel := range wordVowels {
			for _, withVowel := range withWordVowels {
				if vowel.Letter == withVowel.Letter {
					if vowel.Position == withVowel.Position {
						rhymeRate += 0.5
					} else {
						rhymeRate += 0.05
					}
				}
			}
		}
	}

	// Check last letter matches
	if wordLastFourLetters == withWordLastFourLetters {
		rhymeRate += 1
	} else if wordLastThreeLetters == withWordLastThreeLetters {
		rhymeRate += 0.5
	} else if wordLastTwoLetters == withWordLastTwoLetters {
		rhymeRate += 0.05
	}

	// Check similar sounding matches
	if len(wordSimilar) > 0 {
		for _, similar := range wordSimilar {
			similarTwoLetters := getLastN(similar, 2)
			similarThreeLetters := getLastN(similar, 3)
			similarFourLetters := getLastN(similar, 4)

			if similarFourLetters == withWordLastFourLetters {
				rhymeRate += 1
			} else if similarThreeLetters == withWordLastThreeLetters {
				rhymeRate += 0.5
			} else if similarTwoLetters == withWordLastTwoLetters {
				rhymeRate += 0.05
			}
		}
	}

	return rhymeRate
}

type VowelPosition struct {
	Letter   string
	Position int
}

func getVowelLettersFromWord(word string) []VowelPosition {
	var vowels []VowelPosition
	vowelLetters := vowelLetters()
	runes := []rune(word)

	for i, r := range runes {
		letter := string(r)
		if contains(vowelLetters, letter) {
			vowels = append(vowels, VowelPosition{
				Letter:   letter,
				Position: i + 1,
			})
		}
	}

	return vowels
}

func vowelLetters() []string {
	return []string{"а", "ъ", "о", "у", "е", "и"}
}

func getSimilarSounding(word string) []string {
	wordSSC := []string{word}
	consonants := similarSoundingLetters()

	for letter, replacements := range consonants {
		for _, sameSounding := range replacements {
			replacedWord := strings.ReplaceAll(word, letter, sameSounding)
			if replacedWord != word {
				wordSSC = append(wordSSC, replacedWord)
			}

			replacedWord = strings.ReplaceAll(word, sameSounding, letter)
			if replacedWord != word {
				wordSSC = append(wordSSC, replacedWord)
			}
		}
	}

	// Remove duplicates
	unique := make(map[string]bool)
	var result []string
	for _, w := range wordSSC {
		if !unique[w] {
			unique[w] = true
			result = append(result, w)
		}
	}

	return result
}

func similarSoundingLetters() map[string][]string {
	return map[string][]string{
		"т": {"д"},
		"с": {"з"},
		"к": {"г"},
		"п": {"б"},
		"ф": {"в"},
		"ш": {"ж"},
		"щ": {"ж", "шт"},
		"о": {"у"},
	}
}

func wordCombinations(word string, combinationNumbers int) []string {
	var combinations []string
	runes := []rune(word)

	for i := 0; i < len(runes); i++ {
		if i+1 >= len(runes) {
			continue
		}

		if combinationNumbers > 2 && i+2 >= len(runes) {
			continue
		}

		if combinationNumbers > 3 && i+3 >= len(runes) {
			continue
		}

		if combinationNumbers > 4 && i+4 >= len(runes) {
			continue
		}

		var readyAlpha strings.Builder
		readyAlpha.WriteRune(runes[i])
		readyAlpha.WriteRune(runes[i+1])

		if combinationNumbers > 2 {
			readyAlpha.WriteRune(runes[i+2])
		}

		if combinationNumbers > 3 {
			readyAlpha.WriteRune(runes[i+3])
		}

		if combinationNumbers > 4 {
			readyAlpha.WriteRune(runes[i+4])
		}

		combinations = append(combinations, readyAlpha.String())
	}

	return combinations
}

func getLastN(s string, n int) string {
	runes := []rune(s)
	if len(runes) < n {
		return s
	}
	return string(runes[len(runes)-n:])
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

// FindRhymes finds all rhyming words for a given word
// Uses the original algorithm
func FindRhymes(findRhymesForWord string, allWords []string, maxResults int) []RhymeResult {
	return FindRhymesWithAlgorithm(findRhymesForWord, allWords, maxResults, false)
}

// FindRhymesEnhanced finds all rhyming words using the enhanced algorithm
func FindRhymesEnhanced(findRhymesForWord string, allWords []string, maxResults int) []RhymeResult {
	return FindRhymesWithAlgorithm(findRhymesForWord, allWords, maxResults, true)
}

// FindRhymesWithAlgorithm finds rhyming words using either original or enhanced algorithm
func FindRhymesWithAlgorithm(findRhymesForWord string, allWords []string, maxResults int, useEnhanced bool) []RhymeResult {
	var rhymes []RhymeResult

	for _, word := range allWords {
		var rhymeRate float64
		if useEnhanced {
			rhymeRate = GetEnhancedRhymeRate(findRhymesForWord, word)
		} else {
			rhymeRate = GetRhymeRate(findRhymesForWord, word)
		}
		
		// Enhanced algorithm has different scoring, adjust threshold
		threshold := 1.0
		if useEnhanced {
			threshold = 2.0 // Enhanced scores are higher
		}
		
		if rhymeRate < threshold {
			continue
		}

		rhymes = append(rhymes, RhymeResult{
			Word:   word,
			Rating: rhymeRate,
		})
	}

	// Sort by rating descending (using insertion sort for small lists, or could use sort.Slice)
	for i := 0; i < len(rhymes)-1; i++ {
		for j := i + 1; j < len(rhymes); j++ {
			if rhymes[i].Rating < rhymes[j].Rating {
				rhymes[i], rhymes[j] = rhymes[j], rhymes[i]
			}
		}
	}

	if maxResults > 0 && len(rhymes) > maxResults {
		rhymes = rhymes[:maxResults]
	}

	return rhymes
}
