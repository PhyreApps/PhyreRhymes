package stress

import "strings"

// endsWith проверява дали думата завършва с някой от суфиксите
func endsWith(word string, suffixes ...string) bool {
	for _, suffix := range suffixes {
		if strings.HasSuffix(word, suffix) {
			return true
		}
	}
	return false
}

// ApplyRules прилага правила за определяне на ударението
func ApplyRules(word string, syllables []string) (int, float64) {
	syllableCount := len(syllables)
	
	if syllableCount == 0 {
		return 0, 0.0
	}
	
	// Правило 1: Суфикси "-ене", "-ание" -> предпоследна сричка
	if endsWith(word, "ене", "ание", "ение") {
		if syllableCount >= 2 {
			return syllableCount - 1, 0.75
		}
	}
	
	// Правило 2: Завършва на "-и" -> последна сричка
	if endsWith(word, "и") && syllableCount > 1 {
		return syllableCount, 0.70
	}
	
	// Правило 3: Определителен член "-те", "-та", "-то" -> запазва ударението от основната форма
	// За думи завършващи на "-те", "-та", "-то" - ударението обикновено е на първата сричка
	if endsWith(word, "те", "та", "то") && syllableCount >= 2 {
		// Ако думата е достатъчно дълга, вероятно ударението е на първата сричка
		if syllableCount >= 3 {
			return 1, 0.60
		}
		return syllableCount - 1, 0.65
	}
	
	// Правило 3b: Завършва на "-а", "-о", "-е" (без определителен член) -> предпоследна сричка
	if endsWith(word, "а", "о", "е") && syllableCount >= 2 {
		return syllableCount - 1, 0.65
	}
	
	// Правило 4: Завършва на "-ка", "-ца" -> предпоследна сричка
	if endsWith(word, "ка", "ца", "та", "да") && syllableCount >= 2 {
		return syllableCount - 1, 0.60
	}
	
	// Правило 5: Едносрични думи -> ударение на единствената сричка
	if syllableCount == 1 {
		return 1, 0.80
	}
	
	// Fallback: предпоследна сричка (най-често срещано в българския)
	if syllableCount >= 2 {
		return syllableCount - 1, 0.55
	}
	
	return 1, 0.50
}
