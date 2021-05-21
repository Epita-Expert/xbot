require('dotenv').config()

const { Client, Intents, MessageEmbed } = require('discord.js')
const glob = require("glob")
const path = require("path")

let allCommands = {}
glob.sync( './commands/*.js' ).forEach( file => allCommands = {...allCommands, ...require(path.resolve(file))} )

const commands = allCommands
const guildId = process.env.SERVER_ID
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] })

const getApp = (guildId) => {
    const app = client.api.applications(client.user.id)
    if (guildId) {
        app.guilds(guildId)
    }
    return app
}

client.once('ready', () => {
    client.user.setActivity("yBot galérer", { type: "WATCHING"})

    //caching AGENDA channel for reaction listener
    client.channels.cache.get(process.env.AGENDA_ID).messages.fetch()

    //getApp( guildId ).commands('845286888108851250').delete()

    for (const [name, cmd] of Object.entries(commands)) {
        if (typeof cmd.data === 'object')
            getApp( cmd.isGlobal ? null : guildId ).commands.post({data: cmd.data}).then(e => console.log(name + " -> Successfully posted"))
    }


    getApp(guildId).commands.get().then((allCmds) => {
        allCmds.forEach((e) => {
            console.log(e.name + " -> " + e.id)
        })
    })
})

client.on('interaction', interaction => {
    if (!interaction.isCommand())
        return

    if (interaction.commandName in commands) {
        const args = {}
        if (interaction.options) {
            for (const option of interaction.options) {
                const {name, value} = option
                args[name] = value
            }
        }
        interaction.reply(commands[interaction.commandName].callback({channel:interaction.channel, options:args}))
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.message.channel.id === process.env.AGENDA_ID){
        if(reaction._emoji.name == "🔔" && !user.bot){
            // save in database here
            const embed = new MessageEmbed().setTitle('Abonnement à l\'événement pris en compte').setDescription('Tu receveras un rappel 2 semaines, 1 semaine, 48h et 24h avant l\'événement par message privé.').setAuthor('🔔 Notifications xBot').setColor('#6d99d3')
            reaction.message.guild.members.cache.find(member => member.id === user.id).send(embed)
        }
    }
})

client.on('messageReactionRemove', async (reaction, user) => {
    if(reaction.message.channel.id === process.env.AGENDA_ID){
        if(reaction._emoji.name == "🔔" && !user.bot){
            // save in database here
            const embed = new MessageEmbed().setTitle('Désabonnement à l\'événement pris en compte').setDescription('Tu ne receveras plus aucun rappel par message privé pour cet événement.').setAuthor('🔔 Notifications xBot').setColor('#6d99d3')
            reaction.message.guild.members.cache.find(member => member.id === user.id).send(embed)
        }
    }
})

client.on('message', async (message) => {
    if (message.mentions.users.has(process.env.XBOT_ID))
        message.react('👀')
})

client.login(process.env.TOKEN)