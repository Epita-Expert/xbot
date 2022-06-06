const liens = require('../commands/liens.js')
const DiscordTest = require('./TestDiscordJS.js')

describe('liens', () => {

    it('execute liens cmd', async () => {
        await liens.execute({
            interaction:DiscordTest.interaction
        })
    })

})
