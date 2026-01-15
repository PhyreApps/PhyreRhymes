package rhyme

import (
	"rhyme-cli/stress"
	"strings"
)

// GetRhymeSuffix извлича римовата част на думата (от ударената сричка до края)
func GetRhymeSuffix(word string) string {
	syllables := stress.SplitSyllables(word)
	if len(syllables) == 0 {
		return word
	}

	// Определяме ударението
	result := stress.GuessStress(word)
	stressPos := result.Stress

	// Ако ударението е извън границите, използваме последната сричка
	if stressPos < 1 || stressPos > len(syllables) {
		stressPos = len(syllables)
	}

	// Връщаме частта от ударената сричка до края
	rhymePart := strings.Join(syllables[stressPos-1:], "")
	return strings.ToLower(rhymePart)
}

// GetRhymeRateWithStress изчислява римовата оценка с отчитане на ударението
func GetRhymeRateWithStress(word, withWord string) float64 {
	word = strings.ToLower(word)
	withWord = strings.ToLower(withWord)

	if len(word) < 2 || len(withWord) < 2 {
		return 0
	}

	if word == withWord {
		return 0
	}

	var rhymeRate float64

	// Извличаме римовите части (от ударената сричка)
	wordRhymeSuffix := GetRhymeSuffix(word)
	withWordRhymeSuffix := GetRhymeSuffix(withWord)

	// Основна проверка: съвпадение на римовите части
	if wordRhymeSuffix == withWordRhymeSuffix {
		rhymeRate += 3.0 // Много високо съвпадение
	} else {
		// Проверяваме частични съвпадения
		wordSuffixLen := len([]rune(wordRhymeSuffix))
		withWordSuffixLen := len([]rune(withWordRhymeSuffix))
		
		// Сравняваме последните N символа
		for n := 4; n >= 2; n-- {
			if wordSuffixLen >= n && withWordSuffixLen >= n {
				wordEnd := getLastN(wordRhymeSuffix, n)
				withWordEnd := getLastN(withWordRhymeSuffix, n)
				
				if wordEnd == withWordEnd {
					switch n {
					case 4:
						rhymeRate += 2.5
					case 3:
						rhymeRate += 1.5
					case 2:
						rhymeRate += 0.8
					}
					break // Вземаме най-дългото съвпадение
				}
			}
		}
	}

	// Допълнителни проверки с оригиналния алгоритъм
	wordSimilar := getSimilarSounding(word)
	wordLastTwoLetters := getLastN(word, 2)
	wordLastFourLetters := getLastN(word, 4)
	wordLastThreeLetters := getLastN(word, 3)

	withWordLastTwoLetters := getLastN(withWord, 2)
	withWordLastFourLetters := getLastN(withWord, 4)
	withWordLastThreeLetters := getLastN(withWord, 3)

	// Проверка на последните букви (допълнителна)
	if wordLastFourLetters == withWordLastFourLetters {
		rhymeRate += 1.0
	} else if wordLastThreeLetters == withWordLastThreeLetters {
		rhymeRate += 0.5
	} else if wordLastTwoLetters == withWordLastTwoLetters {
		rhymeRate += 0.2
	}

	// Проверка на подобни звучащи варианти
	if len(wordSimilar) > 0 {
		for _, similar := range wordSimilar {
			similarRhymeSuffix := GetRhymeSuffix(similar)
			if similarRhymeSuffix == withWordRhymeSuffix {
				rhymeRate += 2.0
				break
			}

			similarTwoLetters := getLastN(similar, 2)
			similarThreeLetters := getLastN(similar, 3)
			similarFourLetters := getLastN(similar, 4)

			if similarFourLetters == withWordLastFourLetters {
				rhymeRate += 0.8
			} else if similarThreeLetters == withWordLastThreeLetters {
				rhymeRate += 0.4
			} else if similarTwoLetters == withWordLastTwoLetters {
				rhymeRate += 0.1
			}
		}
	}

	// КРИТИЧНО: Проверяваме дали ударенията съвпадат
	wordStress := stress.GuessStress(word)
	withWordStress := stress.GuessStress(withWord)
	
	// Ако ударенията НЕ съвпадат, значително намаляваме рейтинга
	if wordStress.Stress != withWordStress.Stress {
		// Намаляваме рейтинга с 50%, защото без съвпадащо ударение не е добра рима
		rhymeRate = rhymeRate * 0.5
	} else {
		// Бонус ако ударенията съвпадат - това е важно за качествена рима
		rhymeRate += 2.0 // Голям бонус за съвпадащо ударение
	}

	return rhymeRate
}
