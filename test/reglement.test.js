const reglement = require("../commands/reglement.js");
const DiscordTest = require("./TestDiscordJS.js");

describe("reglement", () => {
  it("execute reglement cmd", async () => {
    await reglement.execute({
      interaction: DiscordTest.interaction,
    });
  });
});
