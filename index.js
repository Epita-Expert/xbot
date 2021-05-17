const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')
require('dotenv').config()

const guildId = process.env.SERVER_ID
const client = new DiscordJS.Client({
    partials: ['MESSAGE', 'REACTION']
})

const getApp = (guildId) => {
    const app = client.api.applications(client.user.id)
    if (guildId) {
        app.guilds(guildId)
    }
    return app
}

client.on('ready', () => {
    client.user.setActivity("carry les experts 2023");

    new WOKCommands(client, {
        commandsDir: 'commands',
        testServers: [guildId],
        showWarns: false,
    })

    getApp(guildId).commands.get().then((allCmds) => {
        console.log(allCmds)
    })
})

client.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.message.channel.id === process.env.AGENDA_ID){
        if(reaction._emoji.name == "🔔" && !user.bot){
            // save in database here
            const embed = new DiscordJS.MessageEmbed().setTitle('Abonnement à l\'événement pris en compte').setDescription('Tu receveras un rappel 2 semaines, 1 semaine, 48h et 24h avant l\'événement par message privé.').setAuthor('🔔 Notifications xBot').setColor('#6d99d3')
            reaction.message.guild.members.cache.find(member => member.id === user.id).send(embed)
        }else if(reaction._emoji.name != "🔔"){
            reaction.remove()
        }
    }
})

client.on('messageReactionRemove', async (reaction, user) => {
    if(reaction.message.channel.id === process.env.AGENDA_ID){
        if(reaction._emoji.name == "🔔" && !user.bot){
            // save in database here
            const embed = new DiscordJS.MessageEmbed().setTitle('Désabonnement à l\'événement pris en compte').setDescription('Tu ne receveras plus aucun rappel par message privé pour cet événement.').setAuthor('🔔 Notifications xBot').setColor('#6d99d3')
            reaction.message.guild.members.cache.find(member => member.id === user.id).send(embed)
        }else if(reaction._emoji.name != "🔔"){
            reaction.remove()
        }
    }
})

client.login(process.env.TOKEN)