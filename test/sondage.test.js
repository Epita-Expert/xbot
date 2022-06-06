const sondage = require('../commands/sondage.js')
const DiscordTest = require('./TestDiscordJS.js')

describe('sondage', () => {

    it('execute sondage cmd', async () => {
        const opt = new DiscordTest.options({"question": "question?", "choix_a": "test"})
        await sondage.execute({
            interaction:DiscordTest.interaction,
            options:opt
        })
    })

})
