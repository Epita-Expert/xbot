const karma = require("../commands/karma.js");
const DiscordTest = require("./TestDiscordJS.js");

describe("karma", () => {
  it("execute karma cmd with args", async () => {
    await karma.execute({
      interaction: DiscordTest.interaction,
    });
  });
});
