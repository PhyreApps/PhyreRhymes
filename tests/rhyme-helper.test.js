const RhymeHelperBG = require("../src/rhyme-helper-bg");
test("Check rhymes", () => {

    // expect(RhymeHelperBG.getRhymeRate("Сняг", "Як"))
    //     .toBeGreaterThan(0.04);

    expect(RhymeHelperBG.getRhymeRate("Oдма", "Kобра"))
        .toBeGreaterThan(0.04);

    expect(RhymeHelperBG.getRhymeRate("Помогна", "Доволна"))
        .toBeGreaterThan(0.1);

    expect(RhymeHelperBG.getRhymeRate("Помогна", "Кротна"))
        .toBeGreaterThan(0.1);

    expect(RhymeHelperBG.getRhymeRate("Смогна", "Бодна"))
        .toBeGreaterThan(0.09);

    expect(RhymeHelperBG.getRhymeRate("Непознато", "Десперадо"))
        .toBeGreaterThan(0.4);

    expect(RhymeHelperBG.getRhymeRate("Божидар", "Говедар"))
        .toBeGreaterThan(0.5);

    expect(RhymeHelperBG.getRhymeRate("Гошо", "Лошо"))
        .toBeGreaterThan(0.5);

    expect(RhymeHelperBG.getRhymeRate("Златно", "Безплатно"))
        .toBeGreaterThan(0.5);


})
