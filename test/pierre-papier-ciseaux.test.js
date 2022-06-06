const pierre_papier_ciseaux = require("../commands/pierre-papier-ciseaux");

describe("pierre-papier-ciseaux", () => {
  it("params verification", () => {
    expect(pierre_papier_ciseaux.data.name).toBe("Pierre-papier-ciseaux");
  });
});
