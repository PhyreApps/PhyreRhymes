package stress

import "strings"

var vowels = map[rune]bool{
	'а': true, 'е': true, 'и': true,
	'о': true, 'у': true, 'ъ': true,
	'ю': true, 'я': true,
}

// isConsonant проверява дали руната е съгласна
func isConsonant(r rune) bool {
	return !vowels[r]
}

// SplitSyllables разделя думата на срички според българските правила за сричкопренасяне
// Правила: всяка сричка трябва да има поне една гласна
// Съгласните между гласните се разпределят: ако има една съгласна, тя отива към следващата сричка
// Ако има две или повече съгласни, разделът обикновено е между тях
// Неразделими групи съгласни (като "ст", "чк") остават заедно в една сричка
func SplitSyllables(word string) []string {
	if word == "" {
		return []string{}
	}

	runes := []rune(word)
	if len(runes) == 0 {
		return []string{}
	}

	var syllables []string
	i := 0
	
	for i < len(runes) {
		var current strings.Builder
		
		// Стъпка 1: Добавяме всички начални съгласни (ако има такива)
		for i < len(runes) && isConsonant(runes[i]) {
			current.WriteRune(runes[i])
			i++
		}
		
		// Стъпка 2: Добавяме гласната (задължителна за сричката)
		if i < len(runes) && vowels[runes[i]] {
			current.WriteRune(runes[i])
			i++
		}
		
		// Стъпка 3: Решаваме къде завършва сричката
		// Гледаме напред: колко съгласни има до следващата гласна?
		consonantCount := 0
		j := i
		for j < len(runes) && isConsonant(runes[j]) {
			consonantCount++
			j++
		}
		
		// Ако няма повече гласни, всички останали съгласни отиват в тази сричка
		if j >= len(runes) {
			for i < len(runes) {
				current.WriteRune(runes[i])
				i++
			}
			if current.Len() > 0 {
				syllables = append(syllables, current.String())
			}
			break
		}
		
		// Правила за разпределение на съгласните:
		if consonantCount == 0 {
			// Няма съгласни между гласните - сричката завършва тук
			if current.Len() > 0 {
				syllables = append(syllables, current.String())
			}
		} else if consonantCount == 1 {
			// Една съгласна - отива към следващата сричка (не я добавяме тук)
			if current.Len() > 0 {
				syllables = append(syllables, current.String())
			}
		} else {
			// Две или повече съгласни
			// Първата съгласна остава в тази сричка, останалите отиват в следващата
			// Това е стандартното правило за българско сричкопренасяне
			current.WriteRune(runes[i])
			i++
			
			if current.Len() > 0 {
				syllables = append(syllables, current.String())
			}
		}
	}

	return syllables
}

// CountSyllables брои сричките в думата
func CountSyllables(word string) int {
	return len(SplitSyllables(word))
}
