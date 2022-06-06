const demineur = require("../commands/demineur.js");
const DiscordTest = require("./TestDiscordJS.js");

describe("demineur", () => {
  it("execute dit cmd with args", async () => {
    const opt = new DiscordTest.options();
    await demineur.execute({
      options: opt,
      interaction: DiscordTest.interaction,
      channel: DiscordTest.channel,
    });
  });
});
