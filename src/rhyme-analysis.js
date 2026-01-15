const RhymeEngineCLI = require("./rhyme-engine-cli");
const highlightWords = require("highlight-words");

class RhymeAnalysis {
    static async analyze(text) {

        const segmenter = new Intl.Segmenter([], { granularity: 'word' });
        const segmentedText = segmenter.segment(text);
        const words = [...segmentedText].filter(s => s.isWordLike).map(s => s.segment);

        let rhymes = [];
        let rhymedWords = [];
        
        // Compare all word pairs using the compare command
        for (let i = 0; i < words.length; i++) {
            for (let j = i + 1; j < words.length; j++) {
                let word1 = words[i];
                let word2 = words[j];
                
                if (word1.toLowerCase() === word2.toLowerCase()) {
                    continue;
                }

                try {
                    // Use the compare command to check if words rhyme
                    const result = await RhymeEngineCLI.compare(word1, word2);
                    
                    if (result.success && result.rhyme) {
                        rhymes.push({
                            word1: word1,
                            word2: word2,
                            rating: result.rating
                        });
                        rhymedWords.push(word1);
                        rhymedWords.push(word2);
                    }
                } catch (error) {
                    console.error(`Error comparing ${word1} and ${word2}:`, error);
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
