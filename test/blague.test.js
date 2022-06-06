const blague = require('../commands/blague.js')
const BlaguesAPI = require('blagues-api')
require('dotenv').config()
const DiscordTest = require('./TestDiscordJS.js')

describe('blague', () => {
    it('params verification', () => {
        expect(blague.data.name).toBe('blague');

    });

    it('all choices work', () => {
        blague.data.options.find(e => e.name === "type")?.choices?.forEach(e => {
            const type = e.value
            const blagues = new BlaguesAPI(process.env.BLAGUES_TOKEN);
            return blagues.randomCategorized(blagues.categories[type]).then(data => {
                expect(data.type).toBe(e.value.toLowerCase());
            });

        })
    })

    it('execute blague cmd with args', async () => {
        const opt = new DiscordTest.options({"type": "DEV"})
        await blague.execute({options:opt, interaction:DiscordTest.interaction})
    })

    it('execute blague cmd without args', async () => {
        const emptyOpt = new DiscordTest.options()
        await blague.execute({options:emptyOpt, interaction:DiscordTest.interaction})
    })


})
