const RhymeHelperBG = require("../src/rhyme-helper-bg");
test("Check rhymes", () => {

    // expect(RhymeHelperBG.getRhymeRate("Сняг", "Як"))
    //     .toBeGreaterThan(0.04);

    expect(RhymeHelperBG.getRhymeRate("Божидар", "Говедар"))
        .toBeGreaterThan(0.5);

    expect(RhymeHelperBG.getRhymeRate("Гошо", "Лошо"))
        .toBeGreaterThan(0.5);

    expect(RhymeHelperBG.getRhymeRate("Златно", "Безплатно"))
        .toBeGreaterThan(0.5);


})
