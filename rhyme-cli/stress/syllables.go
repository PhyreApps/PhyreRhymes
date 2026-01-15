package stress

import "strings"

var vowels = map[rune]bool{
	'а': true, 'е': true, 'и': true,
	'о': true, 'у': true, 'ъ': true,
	'ю': true, 'я': true,
}

// SplitSyllables разделя думата на срички
func SplitSyllables(word string) []string {
	var syllables []string
	var current strings.Builder
	runes := []rune(word)

	for _, r := range runes {
		current.WriteRune(r)
		
		// Ако е гласна, завършваме сричката
		if vowels[r] {
			syllables = append(syllables, current.String())
			current.Reset()
		}
	}

	// Ако има останали букви, добавяме ги към последната сричка
	if current.Len() > 0 && len(syllables) > 0 {
		syllables[len(syllables)-1] += current.String()
	} else if current.Len() > 0 {
		// Ако няма срички, но има букви (рядко)
		syllables = append(syllables, current.String())
	}

	return syllables
}

// CountSyllables брои сричките в думата
func CountSyllables(word string) int {
	return len(SplitSyllables(word))
}
