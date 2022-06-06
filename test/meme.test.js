const meme = require('../commands/meme.js')
const DiscordTest = require('./TestDiscordJS.js')

describe('meme', () => {
    it('execute meme cmd with args', async () => {
        const opt = new DiscordTest.options({"subreddit": "nsfw"})
        await meme.execute({options:opt, interaction:DiscordTest.interaction})
    })
    it('execute meme cmd with wrong args', async () => {
        const opt = new DiscordTest.options({"subreddit": "fsdffsdèà*"})
        await meme.execute({options:opt, interaction:DiscordTest.interaction})
    })

    it('execute meme cmd without args', async () => {
        const emptyOpt = new DiscordTest.options()
        await meme.execute({options:emptyOpt, interaction:DiscordTest.interaction})
    })

    it('execute meme cmd with wrong args', async () => {
        const opt = new DiscordTest.options({"subreddit": "nomdesubredditinexistant"})
        await meme.execute({options:opt, interaction:DiscordTest.interaction})
    })


})
