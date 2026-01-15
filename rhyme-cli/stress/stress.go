package stress

import (
	"strings"
)

// Result съдържа резултата от определяне на ударението
type Result struct {
	Word          string  `json:"word"`
	Stressed      string  `json:"stressed"`        // Думата с маркирано ударение
	Stress        int     `json:"stress"`          // Позиция на ударението (1-based по срички)
	StressLetter  string  `json:"stress_letter"`    // Ударената буква
	StressPos     int     `json:"stress_pos"`      // Позиция на ударената буква в думата (1-based)
	Confidence    float64 `json:"confidence"`      // Увереност (0.0 - 1.0)
	Syllables     []string `json:"syllables"`     // Разделени срички
}

// GuessStress определя ударението в думата
func GuessStress(word string) Result {
	word = strings.ToLower(strings.TrimSpace(word))
	if word == "" {
		return Result{Word: word, Stress: 0, Confidence: 0.0}
	}

	syllables := SplitSyllables(word)
	
	// Прилагане на автономни правила
	stressSyllable, confidence := ApplyRules(word, syllables)
	
	stressedWord := ApplyStress(word, stressSyllable)
	
	// Намираме позицията на ударената буква в думата
	stressLetter, stressPos := findStressedLetter(word, stressedWord, stressSyllable, syllables)
	
	return Result{
		Word:         word,
		Stressed:     stressedWord,
		Stress:       stressSyllable,
		StressLetter: stressLetter,
		StressPos:    stressPos,
		Confidence:   confidence,
		Syllables:    syllables,
	}
}

// findStressedLetter намира ударената буква и нейната позиция в думата
func findStressedLetter(originalWord, stressedWord string, stressSyllable int, syllables []string) (string, int) {
	originalRunes := []rune(originalWord)
	stressedRunes := []rune(stressedWord)
	
	// Намираме позицията на ударената буква в stressedWord
	stressedLetterPos := -1
	
	for i := 0; i < len(stressedRunes); i++ {
		r := stressedRunes[i]
		
		// Проверяваме дали е директно ударена гласна (à, è, ì, ò, ù)
		if isStressedVowel(r) {
			stressedLetterPos = i
			break
		}
		
		// Проверяваме за комбиниращ grave accent (U+0300) след гласна
		if i+1 < len(stressedRunes) && stressedRunes[i+1] == '\u0300' {
			if vowels[r] {
				stressedLetterPos = i
				break
			}
		}
	}
	
	if stressedLetterPos == -1 {
		// Fallback: намираме първата гласна в ударената сричка
		if stressSyllable >= 1 && stressSyllable <= len(syllables) {
			syllableStart := 0
			for i := 0; i < stressSyllable-1; i++ {
				syllableStart += len([]rune(syllables[i]))
			}
			stressedSyllable := syllables[stressSyllable-1]
			syllableEnd := syllableStart + len([]rune(stressedSyllable))
			
			for i := syllableStart; i < len(originalRunes) && i < syllableEnd; i++ {
				if vowels[originalRunes[i]] {
					return string(originalRunes[i]), i + 1
				}
			}
		}
		return "", 0
	}
	
	// Сега намираме съответната позиция в originalWord
	// Броим буквите в stressedWord до ударената буква (без accent символите)
	originalPos := 0
	for i := 0; i < stressedLetterPos; i++ {
		if stressedRunes[i] != '\u0300' {
			// Пропускаме accent символите, но броим буквите
			originalPos++
		}
	}
	
	// Намираме съответната гласна в originalWord
	// Трябва да намерим гласната на позиция originalPos или след нея
	for originalPos < len(originalRunes) {
		if vowels[originalRunes[originalPos]] {
			letter := string(originalRunes[originalPos])
			return letter, originalPos + 1 // 1-based позиция
		}
		originalPos++
	}
	
	return "", 0
}

// isStressedVowel проверява дали rune е ударена гласна
func isStressedVowel(r rune) bool {
	stressedVowels := map[rune]bool{
		'à': true, 'è': true, 'ì': true,
		'ò': true, 'ù': true,
	}
	return stressedVowels[r]
}

// ApplyStress прилага визуално ударение към думата
func ApplyStress(word string, stress int) string {
	syllables := SplitSyllables(word)
	
	if stress < 1 || stress > len(syllables) {
		return word
	}

	// Намираме гласната в ударената сричка и добавяме grave accent
	stressedSyllable := syllables[stress-1]
	runes := []rune(stressedSyllable)
	
	// Търсим последната гласна в сричката
	for i := len(runes) - 1; i >= 0; i-- {
		if vowels[runes[i]] {
			accented := addGrave(runes[i])
			// Ако има предварително дефиниран grave символ, използваме него
			if accented != runes[i] {
				runes[i] = accented
			} else {
				// За останалите гласни, добавяме комбиниращ grave accent (U+0300)
				// Конструираме нов string с гласната + accent
				newRunes := make([]rune, 0, len(runes)+1)
				newRunes = append(newRunes, runes[:i+1]...)
				newRunes = append(newRunes, '\u0300') // combining grave accent
				newRunes = append(newRunes, runes[i+1:]...)
				runes = newRunes
			}
			break
		}
	}
	
	syllables[stress-1] = string(runes)
	return strings.Join(syllables, "")
}

// addGrave добавя grave accent към гласна
func addGrave(r rune) rune {
	graveMap := map[rune]rune{
		'а': 'à', 'е': 'è', 'и': 'ì',
		'о': 'ò', 'у': 'ù',
	}
	
	// За останалите гласни използваме комбиниращ grave accent (U+0300)
	// Това работи за 'ъ', 'ю', 'я'
	if v, ok := graveMap[r]; ok {
		return v
	}
	
	// За 'ъ', 'ю', 'я' - връщаме същия символ
	// (в ApplyStress ще добавим комбиниращия accent като отделен символ)
	return r
}
