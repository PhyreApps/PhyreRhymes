const RhymeHelperBG = require("./rhyme-helper-bg");

class RhymeAnalysis {
    static analyze(text) {
        let words = text.split(' ');

        let rhymes = [];
        for (let i = 0; i < words.length; i++) {
            for (let j = 0; j < words.length; j++) {
                if (i === j) {
                    continue;
                }
                let word1 = words[i];
                let word2 = words[j];

                word1 = word1.replace(/[^a-zA-Zа-яА-Я]/g, '');
                word2 = word2.replace(/[^a-zA-Zа-яА-Я]/g, '');

                let rhymeRate = RhymeHelperBG.getRhymeRate(word1, word2);
                if (rhymeRate > 0) {
                    rhymes.push({
                        word1: word1,
                        word2: word2,
                        rating: rhymeRate
                    });
                }
            }
        }

        return rhymes;
    }
}

module.exports = RhymeAnalysis;
