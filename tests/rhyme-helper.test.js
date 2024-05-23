const RhymeHelperBG = require("../src/rhyme-helper-bg");
test("Check rhymes", () => {


    expect(RhymeHelperBG.getRhymeRate("Божидар", "Говедар"))
        .toBeGreaterThan(0.5);

    expect(RhymeHelperBG.getRhymeRate("Гошо", "Лошо"))
        .toBeGreaterThan(0.5);

    expect(RhymeHelperBG.getRhymeRate("Златно", "Безплатно"))
        .toBeGreaterThan(0.5);




})
