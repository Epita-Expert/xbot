const silence = require('../commands/silence.js')
const DiscordTest = require('./TestDiscordJS.js')

describe('silence', () => {

    it('execute silence cmd', async () => {
        await silence.execute({
            interaction:DiscordTest.interaction,
            channel:DiscordTest.channel
        })
    })

})
