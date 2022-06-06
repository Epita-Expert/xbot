const aleatoire = require('../commands/aleatoire.js')
const DiscordTest = require('./TestDiscordJS.js')

describe('aleatoire', () => {

    it('execute aleatoire cmd with args', async () => {
        const opt = new DiscordTest.options({"min": 7, "max": 69})
        await aleatoire.execute({options:opt, interaction:DiscordTest.interaction})
    })

    it('execute aleatoire cmd without args', async () => {
        const opt = new DiscordTest.options({"min": null, "max": null})
        await aleatoire.execute({options:opt, interaction:DiscordTest.interaction})
    })

    it('execute aleatoire cmd with wrong args', async () => {
        const opt = new DiscordTest.options({"min": 69, "max": 42})
        await aleatoire.execute({options:opt, interaction:DiscordTest.interaction})
    })


})
