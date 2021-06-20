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
    client.user.setActivity("Minority Report", { type: "WATCHING"})
    //client.user.setPresence({ activity: { name: 'MAINTENANCE EN COURS' }, status: 'dnd' })

    //caching AGENDA channel for reaction listener & MEMBERS
    guildId.forEach((guild) => {
        client.guilds.cache.get(guild).members.fetch()
        let agenda = client.guilds.cache.get(guild).channels.cache.find(chan => chan.name === "📅-agenda")
        if (agenda) {
            agenda.messages.fetch()
        } else {
            console.warn("No channel named \"📅-agenda\" found in guild "+guild)
        }
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
                const cmd = commands[e.name]
                if ("default_permission" in cmd.data && cmd.data.default_permission === false && cmd.permissions) {
                    //getApp(guild).commands.permissions.setPermissions(e.id, cmd.permissions).then(e => console.log(e))
                    /*client.application.commands.fetch(e.id)
                        .then((command) => {
                            console.log(`Fetched command ${command.name}`)
                            command.setPermissions(cmd.permissions)
                                .then(console.log)
                                .catch(console.error)
                        })*/
                }
                if (typeof cmd.init === 'function' && !('isInit' in cmd)) {
                    cmd.init({client:client})
                    cmd.isInit = true
                }
            })
        })
    })
})

client.on('interaction', async interaction => {
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
        const callback = await commands[interaction.commandName].callback({channel:interaction.channel, options:args, user:interaction.user, subcommands:subcommands, client:client})
        interaction.reply(callback)
    }
})

client.on('message', async (message) => {
    if (message.mentions.users.has(client.user.id)
        || message.content.indexOf("<@"+client.user.id+">") > -1
        || message.content.indexOf("<@!"+client.user.id+">") > -1)
        message.react('👀')
})

client.login(process.env.TOKEN)