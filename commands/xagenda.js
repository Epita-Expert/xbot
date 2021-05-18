const { MessageEmbed } = require('discord.js')

//const scheduledSchema = require('../models/agenda-schema')

module.exports = {
    slash: true,
    testOnly: true,
    description: 'Ajoute un événement dans le salon Agenda',
    expectedArgs: '<nom> <description> <date> [module] [prof]',
    minArgs: 3,
    maxArgs: 5,
    callback: ({ message, channel, args }) => {
        const [nom, description, date, module, prof] = args

        const embed = new MessageEmbed().setTitle(date + ' - ' + nom).setDescription(description).setAuthor('📅 À venir').setColor('#6d99d3')

        embed.addField('Module', module || '-', true)
        embed.addField('Prof.', prof || '-', true)

        //embed.setFooter('🔔 Clique sur la cloche pour recevoir un rappel 2 sem., 1 sem., 48h et 24h avant l\'événement en MP.')

        channel.guild.channels.cache.get(process.env.AGENDA_ID).send(embed).then(sentEmbed => {
            //sentEmbed.react('🔔')
        })

        return 'L\'événement a bien été ajouté dans <#' + process.env.AGENDA_ID + '>. (bientôt dispo.) Tu peux t\'abonner aux rappels en cliquant sur :bell: sous l\'événement.'
    },
}
