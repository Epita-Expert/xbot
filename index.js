require('dotenv').config()

const { Client, Intents, MessageEmbed } = require('discord.js')
const glob = require("glob")
const path = require("path")

let allCommands = {}
glob.sync( './commands/*.js' ).forEach( file => allCommands = {...allCommands, ...require(path.resolve(file))} )

const commands = allCommands
const guildId = process.env.SERVER_ID.split(',')
const client = new Client({ intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS
    ] })

const getApp = (guildId) => {
    const app = client.api.applications(client.user.id)
    if (guildId) {
        app.guilds(guildId)
    }
    return app
}

client.once('ready', () => {
    client.user.setActivity("yBot galérer", { type: "WATCHING"})

    //caching AGENDA channel for reaction listener & MEMBERS
    client.channels.cache.get(process.env.AGENDA_ID).messages.fetch()
    guildId.forEach((guild) => {
        client.guilds.cache.get(guild).members.fetch()
    })

    //getApp( guildId ).commands('845286888108851250').delete()

    for (const [name, cmd] of Object.entries(commands)) {
        if (typeof cmd.data === 'object') {
            if (cmd.isGlobal) {
                getApp().commands.post({data: cmd.data}).then(e => console.log(name + " -> Successfully posted [Global command]"))
            } else {
                guildId.forEach((guild) => {
                    getApp(guild).commands.post({data: cmd.data}).then(e => console.log(name + " -> Successfully posted [guildId:" + guild + "]"))
                })
            }
            if (typeof cmd.init === 'function')
                cmd.init({client:client})
        }
    }

    getApp().commands.get().then((allCmds) => {
        allCmds.forEach((e) => {
            console.log(e.name + " -> " + e.id + " [Global command]")
        })
    })
    guildId.forEach((guild) => {
        getApp(guild).commands.get().then((allCmds) => {
            allCmds.forEach((e) => {
                console.log(e.name + " -> " + e.id + " [guildId:" + guild + "]")
            })
        })
    })
})

client.on('interaction', interaction => {
    if (!interaction.isCommand())
        return

    if (interaction.commandName in commands) {
        const args = {}
        const subcommands = []
        if (interaction.options.length) {
            let options = interaction.options
            while (options && options.length && (options[0].type === "SUB_COMMAND" || options[0].type === "SUB_COMMAND_GROUP")) {
                subcommands.push(options[0].name)
                options = options[0].options
            }
            if (options) {
                for (const option of options) {
                    const {name, value} = option
                    args[name] = value
                }
            }
        }
        interaction.reply(commands[interaction.commandName].callback({channel:interaction.channel, options:args, user:interaction.user, subcommands:subcommands}))
    }
})

client.on('message', async (message) => {
    if (message.mentions.users.has(process.env.XBOT_ID))
        message.react('👀')
})

client.login(process.env.TOKEN)