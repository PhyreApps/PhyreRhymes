// Read content from file
const fs = require('fs');
const RhymeEngine = require('./rhyme-engine');
const RhymeAnalysis = require("./rhyme-analysis");
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

// let rhymes = RhymeEngine.rhyme('божидар');
//
// console.log(rhymes);

let txt = '' +
    ' За тебе ставам звяр одма, хапя като кобра' +
    ' и на себе си не мога да помогна. ' +
    'Само аз мога да те правя и доволна, ' +
    'и бясна и после да те кротна. ' +
    'Беше непознато, беше десперадо, ' +
    'на леглото ми гърмя като граната. ' +
    'Ти дойде и се вилня като торнадо,' +
    'беше микс между пого и балада. ' +
    'Не си способна да седиш самотна. ' +
    'Мойта роля беше да те направя мокра, ' +
    'да не си отровна , не мога да ти смогна, ' +
    'вкусотия дето искам да я бодна. ' +
    'Не питай защо, само здраво се дръж, ' +
    'мед ще ми носиш когато сваля те веднъж.';

let rhymeAnalysis = RhymeAnalysis.analyze(txt);

console.log(rhymeAnalysis);
