const RhymeHelperBG = require("./rhyme-helper-bg");

class RhymeAnalysis {
    static analyze(text) {

        let textColored = text;
        let words = text.split(' ');
        let colors = [
            '#FF0000',
            '#00FF00',
            '#0000FF',
            '#FFFF00',
            '#00FFFF',
            '#FF00FF',
            '#FFA500',
            '#800080',
            '#008000',
            '#000080',
            '#800000',
            '#808000',
            '#008080',
            '#800080',
            '#808080',
            '#FFC0CB',
            '#FF4500',
            '#FFD700',
            '#FF6347',
            '#FF69B4',
            '#FFA07A',
            '#FFA500',
            '#FFD700',
            '#FF6347',
            '#FF69B4',
            '#FFA07A',
            '#FFA500',
            '#FFD700',
            '#FF6347',
            '#FF69B4',
            '#FFA07A',
            '#FFA500',
            '#FFD700',
            '#FF6347',
            '#FF69B4',
            '#FFA07A',
            '#FFA500',
            '#FFD700',
            '#FF6347',
            '#FF69B4',
            '#FFA07A',
            '#FFA500',
            '#FFD700',
        ];

        let ryhmeI = 0;
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

                    let color = colors[ryhmeI];
                    ryhmeI++;

                    textColored = textColored.replace(" "+word1, ` <span style="color:${color}">${word1}</span> `);
                    textColored = textColored.replace(" "+word2, ` <span style="color:${color}">${word2}</span> `);

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

}

module.exports = RhymeAnalysis;
