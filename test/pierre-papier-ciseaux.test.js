const pierre_papier_ciseaux = require('../commands/pierre-papier-ciseaux')
const DiscordTest = require("./TestDiscordJS.js");
const blague = require("../commands/blague.js");

describe('pierre-papier-ciseaux', () => {
    it('params verification', ()=> {
      expect(pierre_papier_ciseaux.data.name).toBe('Pierre-papier-ciseaux');
    });

    it('execute ppc cmd same user', async () => {
        const opt = new DiscordTest.options()
        const u = new DiscordTest.user()
        await pierre_papier_ciseaux.execute({
            options:opt,
            interaction:DiscordTest.interaction,
            user: u,
            channel:DiscordTest.channel
        })
    })

    it('execute ppc cmd other user', async () => {
        const opt = new DiscordTest.options()
        const u = new DiscordTest.user("test")
        await pierre_papier_ciseaux.execute({
            options:opt,
            interaction:DiscordTest.interaction,
            user: u,
            channel:DiscordTest.channel,
            client: DiscordTest.client
        })
    })

    it('execute ppc cmd', async () => {
        const opt = new DiscordTest.options()
        const u = new DiscordTest.user("test")
        DiscordTest.client.user = u
        await pierre_papier_ciseaux.execute({
            options:opt,
            interaction:DiscordTest.interaction,
            user: u,
            channel:DiscordTest.channel,
            client: DiscordTest.client
        })
    })

})
