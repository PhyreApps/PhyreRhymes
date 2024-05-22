const RhymeHelperBG = require("./rhyme-helper-bg");

class RhymeAnalysis {
    static analyze(text) {

        let textColored = text;
        let words = text.split(' ');
        let colors = ['yellow', 'green', 'blue', 'indigo', 'purple', 'pink', 'red'];

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

                    let word1PositionStart = textColored.indexOf(word1);
                    let word1PositionEnd = word1PositionStart + word1.length;
                    let word2PositionStart = textColored.indexOf(word2);
                    let word2PositionEnd = word2PositionStart + word2.length;

                    let color = colors[Math.floor(Math.random() * colors.length)];

                    if (word1PositionStart > 0 && word1PositionEnd > 0) {
                        textColored = this.replaceSubstring(textColored, word1PositionStart, word1PositionEnd, `<span style="color:${color}">${word1}</span>`);
                    }

                    rhymes.push({
                        word1: word1,
                        word2: word2,
                        rating: rhymeRate
                    });
                }
            }
        }

        return textColored;
    }

    static replaceSubstring(str, start, end, replacement) {
        if (start < 0 || end >= str.length || start > end) {
            throw new Error("Invalid start or end positions");
        }

        let before = str.substring(0, start);
        let after = str.substring(end + 1);

        return before + replacement + after;
    }
}

module.exports = RhymeAnalysis;
