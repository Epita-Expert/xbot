const roles = require('../commands/roles.js')
const DiscordTest = require('./TestDiscordJS.js')

describe('roles', () => {

    it('execute roles cmd with args', async () => {
        const opt = new DiscordTest.options()
        await roles.execute({
            options:opt,
            interaction:DiscordTest.interaction,
            channel:DiscordTest.channel
        })
    })

    it('callback roles cmd with args', async () => {
        try {
            await roles.callback({
                interaction:DiscordTest.interaction,
                channel:DiscordTest.channel
            })
        } catch (e) {
            expect(e).toBe("Rôle invalide");
        }
    })
})
