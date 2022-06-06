const statut = require("../commands/statut.js");
const DiscordTest = require("./TestDiscordJS.js");

describe("statut", () => {
  it("execute statut cmd", async () => {
    const opt = new DiscordTest.options({
      message: "statut",
      type: "watching",
    });
    await statut.execute({
      interaction: DiscordTest.interaction,
      options: opt,
      client: DiscordTest.client,
    });
  });

  it("execute statut cmd too long", async () => {
    const opt = new DiscordTest.options({
      message:
        "statutstatutstatutstatutstatutstatutstatutstatutstatutstatutstatutstatutstatutstatut",
      type: "watching",
    });
    try {
      await statut.execute({
        interaction: DiscordTest.interaction,
        options: opt,
        client: DiscordTest.client,
      });
    } catch (e) {
      expect(e).toBe("status string is too long (more than 64 characters)");
    }
  });
});
