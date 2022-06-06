const okbot = require("../commands/okbot.js");
const DiscordTest = require("./TestDiscordJS.js");

describe("okbot", () => {
  it("execute okbot cmd with args", async () => {
    await okbot.execute({
      interaction: DiscordTest.interaction,
      channel: DiscordTest.channel,
    });
  });
});
