class RhymeHelperBG {

    static getRhymeRate(word, withWord) {

        if (word.length < 2) {
            return 0;
        }
        if (withWord.length < 2) {
            return 0;
        }
        word = word.toLowerCase();
        withWord = withWord.toLowerCase();
        if (word === withWord) {
            return 0;
        }

        let rhymeRate = 0;
        const wordSimilar = this.getSimilarSounding(word);
        const wordCombinations = this.wordCombinations(word, 4);
        const wordLastTwoLetters = word.substring(word.length - 2);
        const wordLastFourLetters = word.substring(word.length - 4);
        const wordLastThreeLetters = word.substring(word.length - 3);

        const withWordSimilar = this.getSimilarSounding(withWord);
        const withWordCombinations = this.wordCombinations(withWord, 4);
        const withWordLastTwoLetters = withWord.substring(withWord.length - 2);
        const withWordLastFourLetters = withWord.substring(withWord.length - 4);
        const withWordLastThreeLetters = withWord.substring(withWord.length - 3);

        if (wordLastFourLetters === withWordLastFourLetters) {
            rhymeRate = rhymeRate + 1;
        }
        if (wordLastThreeLetters === withWordLastThreeLetters) {
            rhymeRate = rhymeRate + 0.5;
        }
        if (wordLastTwoLetters === withWordLastTwoLetters) {
            rhymeRate = rhymeRate + 0.05;
        }

        if (wordSimilar.length > 0) {
            for (let similar of wordSimilar) {

                let wordSimilarTwoLetters = similar.substring(similar.length - 2);
                let wordSimilarThreeLetters = similar.substring(similar.length - 3);
                let wordSimilarFourLetters = similar.substring(similar.length - 4);

                if (wordSimilarTwoLetters === withWordLastTwoLetters) {
                    rhymeRate = rhymeRate + 0.05;
                }
                if (wordSimilarThreeLetters === withWordLastThreeLetters) {
                    rhymeRate = rhymeRate + 0.5;
                }
                if (wordSimilarFourLetters === withWordLastFourLetters) {
                    rhymeRate = rhymeRate + 1;
                }

            }
        }

        return rhymeRate;
    }

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
