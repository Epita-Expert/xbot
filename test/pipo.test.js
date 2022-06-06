const pipo = require('../commands/pipo.js')
const DiscordTest = require('./TestDiscordJS.js')

describe('pipo', () => {

    it('execute pipo cmd', async () => {
        await pipo.execute({
            interaction:DiscordTest.interaction
        })
    })

})
