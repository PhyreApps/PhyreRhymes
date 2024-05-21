class RhymeHelperBG {
    static wordCombinations(word, combinationNumbers = 3) {
        let combinations = [];
        let alphabets = this.split(word);
        let i = 0;

        for (let alpha of alphabets) {
            i++;

            if (!alphabets[i]) {
                continue;
            }

            if (combinationNumbers > 2 && !alphabets[i + 1]) {
                continue;
            }

            if (combinationNumbers > 3 && !alphabets[i + 2]) {
                continue;
            }

            if (combinationNumbers > 4 && !alphabets[i + 3]) {
                continue;
            }

            let readyAlpha = alpha + alphabets[i];

            if (combinationNumbers > 2) {
                readyAlpha += alphabets[i + 1];
            }

            if (combinationNumbers > 3) {
                readyAlpha += alphabets[i + 2];
            }

            if (combinationNumbers > 4) {
                readyAlpha += alphabets[i + 3];
            }

            combinations.push(readyAlpha);
        }

        return combinations;
    }

    static split(str, len = 1) {
        let arr = [];
        let length = str.length;

        for (let i = 0; i < length; i += len) {
            arr.push(str.substr(i, len));
        }

        return arr;
    }

    static getSimilarSounding(getWord) {
        let wordSSC = [];
        wordSSC.push(getWord);
        let consonants = this.similarSoundingLetters();

        for (let letter in consonants) {
            if (consonants.hasOwnProperty(letter)) {
                for (let sameSounding of consonants[letter]) {
                    let replacedWord = getWord.split(letter).join(sameSounding);
                    wordSSC.push(replacedWord);

                    replacedWord = getWord.split(sameSounding).join(letter);
                    wordSSC.push(replacedWord);
                }
            }
        }

        wordSSC = [...new Set(wordSSC)];
        return wordSSC;
    }

    static similarSoundingLetters() {
        return {
            "т": ["д"],
            "с": ["з"],
            "к": ["г"],
            "п": ["б"],
            "ф": ["в"],
            "ш": ["ж"],
            "щ": ["ж", "шт"],
            "о": ["у"]
        };
    }

    static soundlyAndSoundlessConsonants() {
        return {
            "ба": "па",
            "бъ": "пъ",
            "бо": "по",
            "бу": "пу",
            "бе": "пе",
            "би": "пи",

            "ва": "фа",
            "въ": "фъ",
            "во": "фо",
            "ву": "фу",
            "ве": "фе",
            "ви": "фи",

            "да": "та",
            "дъ": "тъ",
            "до": "то",
            "ду": "ту",
            "де": "те",
            "ди": "ти",

            "за": "са",
            "зъ": "съ",
            "зо": "со",
            "зу": "су",
            "зе": "се",
            "зи": "си",

            "жа": "ша",
            "жъ": "шъ",
            "жо": "шо",
            "жу": "шу",
            "же": "ше",
            "жи": "ши",

            "га": "ка",
            "гъ": "къ",
            "го": "ко",
            "гу": "ку",
            "ге": "ке",
            "ги": "ки"
        };
    }
}

module.exports = RhymeHelperBG;
