const tarot = require('../commands/tarot.js')
const DiscordTest = require('./TestDiscordJS.js')

describe('tarot', () => {

    it('execute tarot cmd with args', async () => {
        const opt = new DiscordTest.options({"question": "question"})
        await tarot.execute({
            interaction:DiscordTest.interaction,
            channel:DiscordTest.channel,
            options:opt
        })
    })


})
