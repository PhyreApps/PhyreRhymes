const RhymeHelperBG = require("./rhyme-helper-bg");
const words = require("./dict/bg-words.json");
class RhymeEngine {
    static rhyme(findRhymesForWord) {

        const words = require('./dict/bg-words.json');

        let findRhymesForWordSimilar = RhymeHelperBG.getSimilarSounding(findRhymesForWord);
        let findRhymesForWordCombinations = RhymeHelperBG.wordCombinations(findRhymesForWord, 4);
        let findRhymesForWordLastFourLetters = findRhymesForWord.substring(findRhymesForWord.length - 4);
        let findRhymesForWordLastThreeLetters = findRhymesForWord.substring(findRhymesForWord.length - 3);


        let rhymes = [];
        let maxRyhmes = 30;

        for (let i = 0; i < words.length; i++) {

            let rhymeRate = 0;
            const word = words[i];
            const wordSimilar = RhymeHelperBG.getSimilarSounding(word);
            const wordCombinations = RhymeHelperBG.wordCombinations(word, 4);
            const wordLastFourLetters = word.substring(word.length - 4);
            const wordLastThreeLetters = word.substring(word.length - 3);

            // for (let j = 0; j < wordCombinations.length; j++) {
            //     if (findRhymesForWordCombinations.includes(wordCombinations[j])) {
            //         rhymeRate = rhymeRate + 0.5;
            //     }
            // }
            if (findRhymesForWordLastFourLetters === wordLastFourLetters) {
                rhymeRate = rhymeRate + 1;
            }
            if (findRhymesForWordLastThreeLetters === wordLastThreeLetters) {
                rhymeRate = rhymeRate + 0.5;
            }


            if (rhymeRate === 0) {
                continue;
            }

            rhymes.push({
                word: word,
                rating: rhymeRate
            });

        }

        rhymes.sort((a, b) => {
            return b.rating - a.rating;
        });

        return rhymes.slice(0, maxRyhmes);
    }
}
module.exports = RhymeEngine;
