const dit = require('../commands/dit.js')
const DiscordTest = require('./TestDiscordJS.js')

describe('dit', () => {

    it('execute dit cmd with args', async () => {
        const opt = new DiscordTest.options({"message": "test", "salon": null})
        const u = new DiscordTest.user()
        await dit.execute({
            options:opt,
            interaction:DiscordTest.interaction,
            channel:DiscordTest.channel,
            user:u
        })
    })

    it('execute dit cmd with long args', async () => {
        const opt = new DiscordTest.options({"message": "testtesttesttesttesttesttesttesttesttesttest", "salon": DiscordTest.channel})
        const u = new DiscordTest.user()
        await dit.execute({
            options:opt,
            interaction:DiscordTest.interaction,
            channel:DiscordTest.channel,
            user:u
        })
    })


})
