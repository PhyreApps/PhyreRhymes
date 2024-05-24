const RhymeHelperBG = require("./rhyme-helper-bg");
const words = require("./dict/bg-words.json");
class RhymeEngine {
    static rhyme(findRhymesForWord) {

        const words = require('./dict/bg-words.json');

        let rhymes = [];
        let maxRyhmes = 10000;

        for (let i = 0; i < words.length; i++) {

            const word = words[i];

            let rhymeRate = RhymeHelperBG.getRhymeRate(findRhymesForWord, words[i]);
            if (rhymeRate < 1) {
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
