const RhymeHelperBG = require("./rhyme-helper-bg");
const highlightWords = require("highlight-words");

class RhymeAnalysis {
    static analyze(text) {

        const segmenter = new Intl.Segmenter([], { granularity: 'word' });
        const segmentedText = segmenter.segment(text);
        const words = [...segmentedText].filter(s => s.isWordLike).map(s => s.segment);

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
        let rhymedWords = [];
        for (let i = 0; i < words.length; i++) {
            for (let j = 0; j < words.length; j++) {
                if (i === j) {
                    continue;
                }
                let word1 = words[i];
                let word2 = words[j];

                let rhymeRate = RhymeHelperBG.getRhymeRate(word1, word2);
                if (rhymeRate > 1) {

                    rhymes.push({
                        word1: word1,
                        word2: word2,
                        rating: rhymeRate
                    });
                    rhymedWords.push(word1);
                    rhymedWords.push(word2);
                }
            }
        }
        // Remove duplicates
        rhymedWords = rhymedWords.filter((item, index) => rhymedWords.indexOf(item) === index);

        let chunks = highlightWords.default({
            text: text,
            query: '/('+rhymedWords.join('|')+')/'
        });

        let highlightText = '';
        for (let i = 0; i < chunks.length; i++) {
            if (chunks[i].match) {
                highlightText += '<b class="text-green-500">' + chunks[i].text + '</b>';
            } else {
                highlightText += '<span>' + chunks[i].text + '</span>';
            }
        }

        highlightText += '<br/><br/>';
        highlightText += 'Общо рими: ' + rhymedWords.length + '<br/>';

        highlightText = highlightText.replace(/\r?\n|\r\./g, '<br>');

        return highlightText;
    }

}

module.exports = RhymeAnalysis;
