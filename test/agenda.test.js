const agenda = require("../commands/agenda.js");
const DiscordTest = require("./TestDiscordJS.js");

describe("agenda", () => {
  it("execute agenda cmd", async () => {
    const opt = new DiscordTest.options();
    try {
      await agenda.execute({
        interaction: DiscordTest.interaction,
        channel: DiscordTest.channel,
        options: opt,
      });
    } catch (e) {
      expect(e).toBe("Erreur lors de l'exécution de la commande agenda");
    }
  });
});
