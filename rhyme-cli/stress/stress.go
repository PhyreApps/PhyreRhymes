package stress

import (
	"strings"
)

// Result съдържа резултата от определяне на ударението
type Result struct {
	Word       string  `json:"word"`
	Stressed   string  `json:"stressed"`   // Думата с маркирано ударение
	Stress     int     `json:"stress"`      // Позиция на ударението (1-based)
	Confidence float64 `json:"confidence"`  // Увереност (0.0 - 1.0)
	Syllables  []string `json:"syllables"`  // Разделени срички
}

// GuessStress определя ударението в думата
func GuessStress(word string) Result {
	word = strings.ToLower(strings.TrimSpace(word))
	if word == "" {
		return Result{Word: word, Stress: 0, Confidence: 0.0}
	}

	syllables := SplitSyllables(word)
	
	// Прилагане на автономни правила
	stress, confidence := ApplyRules(word, syllables)
	
	return Result{
		Word:       word,
		Stressed:   ApplyStress(word, stress),
		Stress:     stress,
		Confidence: confidence,
		Syllables:  syllables,
	}
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
