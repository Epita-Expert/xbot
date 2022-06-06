const ping = require('../commands/ping.js')
const DiscordTest = require('./TestDiscordJS.js')

describe('ping', () => {

    it('execute ping cmd', async () => {
        await ping.execute({
            interaction:DiscordTest.interaction
        })
    })

})
