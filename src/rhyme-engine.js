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
        let maxRyhmes = 10000;

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
                rhymeRate = rhymeRate + 1;
            }


            if (rhymeRate === 0) {
                continue;
            }

            let tailwindClass = 'text-yellow-500';

            if (rhymeRate == 0.25) {
                tailwindClass = 'text-yellow-500/10 hover:text-yellow-500';
            } else if (rhymeRate === 0.50) {
                tailwindClass = 'text-yellow-500/20 hover:text-yellow-500';
            } else if (rhymeRate === 0.75) {
                tailwindClass = 'text-yellow-500/30 hover:text-yellow-500';
            } else if (rhymeRate === 1) {
                tailwindClass = 'text-yellow-500/40 hover:text-yellow-500';
            } else if (rhymeRate === 1.25) {
                tailwindClass = 'text-yellow-500/50 hover:text-yellow-500';
            } else if (rhymeRate === 1.50) {
                tailwindClass = 'text-yellow-500/60 hover:text-yellow-500';
            } else if (rhymeRate === 1.75) {
                tailwindClass = 'text-yellow-500/70 hover:text-yellow-500';
            } else if (rhymeRate === 2) {
                tailwindClass = 'text-yellow-500 hover:text-yellow-500';
            } else if (rhymeRate > 2.25) {
                tailwindClass = 'text-yellow-600 hover:text-yellow-500';
            }

            rhymes.push({
                word: word,
                rating: rhymeRate,
                tailwindClass: tailwindClass,
            });

        }

        rhymes.sort((a, b) => {
            return b.rating - a.rating;
        });

        return rhymes.slice(0, maxRyhmes);
    }
}
module.exports = RhymeEngine;
