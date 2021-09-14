const config = require('dotenv').config().parsed
const fs = require('fs')
const { Client, Collection, Intents } = require('discord.js')


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS] })
client.commands = new Map()
const approvedGuilds = config.SERVER_ID.split(',')

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.data.name, command)
}


const getApp = (guildId) => {
    const app = client.api.applications(client.user.id)
    if (guildId) {
        app.guilds(guildId)
    }
    return app
}

client.once('ready', () => {

    //to delete specific command from guilds
    /*approvedGuilds.forEach( async guild => {
        const command = await client.guilds.cache.get(guild)?.commands.fetch();
        command.forEach(async cmd => {
            if (cmd.name == "test" || cmd.name == "bescherelle") {
                await client.guilds.cache.get(guild)?.commands.delete(cmd.id);
            }
        })
    })*/

    //pushing commands to the discord API
    client.commands.forEach( async cmd => {
        let command = undefined;
        if (cmd.isGlobal) {
            command =  await client.application?.commands.create(cmd.data)
            if ("permissions" in cmd.data) {
                await command.permissions.set({ permissions : cmd.data.permissions })
            }
        } else {
            approvedGuilds.forEach( async guild => {
                if ("guilds" in cmd && cmd.guilds.indexOf(guild) === -1) {
                    return;
                }
                command = await client.guilds.cache.get(guild)?.commands.create(cmd.data)
                if ("permissions" in cmd.data) {
                    await command.permissions.set({ permissions : cmd.data.permissions })
                }
            })
        }
        if (typeof cmd.init === 'function') {
            cmd.init({client:client})
        }
        console.log('"' + cmd.data.name + '" is ready! ('+(cmd.isGlobal?'globally: all guilds':('locally: '+("guilds" in cmd ? cmd.guilds.join(",") : approvedGuilds.join(","))))+')')
    });

    //caching AGENDA channel for reaction listener & MEMBERS
    approvedGuilds.forEach( guild => {
        client.guilds.cache.get(guild).members.fetch()
        let agenda = client.guilds.cache.get(guild).channels.cache.find(chan => chan.name === "📅-agenda")
        if (agenda) {
            agenda.messages.fetch()
        } else {
            console.warn("No channel named \"📅-agenda\" found in guild "+guild)
        }
    })

    console.log('Ready!')
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (!client.commands.has(interaction.commandName)) return;

    try {
        await client.commands.get(interaction.commandName).execute({options: interaction.options, channel:interaction.channel, user:interaction.user, client:client, interaction:interaction});
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de cette commande !', ephemeral: true });
    }
})

client.on('messageCreate', async (message) => {
    if ((message.mentions.users.has(client.user.id)
        || message.content.indexOf("<@"+client.user.id+">") > -1
        || message.content.indexOf("<@!"+client.user.id+">") > -1)
        && message.author.id != client.user.id)
        message.react('👀')
})

client.login(config.TOKEN)