// Read content from file
const fs = require('fs');
const RhymeEngine = require('./rhyme-engine');
//
// // Read the file
// const rhyme = fs.readFileSync('src/dict/bg-spellchecked.txt', 'utf8');
//
// // Explode lines
// const lines = rhyme.split('\n');
//
// // Export the lines to json file
// fs.writeFileSync('src/dict/bg-words.json', JSON.stringify(lines));
// return;

let rhymes = RhymeEngine.rhyme('божидар');

console.log(rhymes);
