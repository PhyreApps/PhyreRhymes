// Read content from file
const RhymeEngine = require('./rhyme-engine');
const RhymeAnalysis = require("./rhyme-analysis");
const RhymeHelperBG = require("./rhyme-helper-bg");
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
    ' За тебе ставам звяр одма, хапя като кобра \n' +
    ' и на себе си не мога да помогна. \n' +
    'Само аз мога да те правя и доволна, \n' +
    'и бясна и после да те кротна. \n' +
    'Беше непознато, беше десперадо, \n' +
    'на леглото ми гърмя като граната. \n' +
    'Ти дойде и се вилня като торнадо,\n' +
    'беше микс между пого и балада. \n' +
    'Не си способна да седиш самотна. \n' +
    'Мойта роля беше да те направя мокра, \n' +
    'да не си отровна , не мога да ти смогна, \n' +
    'вкусотия дето искам да я бодна. \n' +
    'Не питай защо, само здраво се дръж, \n' +
    'мед ще ми носиш когато сваля те веднъж.';

// let rhymeAnalysis = RhymeAnalysis.analyze(txt);
//
// console.log(rhymeAnalysis);

//RhymeHelperBG.getRhymeRate("Сняг", "Як");

let rhymeTopRanking = [];

const words = require('./dict/bg-words.json');
