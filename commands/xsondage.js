const { MessageEmbed } = require('discord.js')

const nextChar = (c) => {
    return String.fromCharCode(c.charCodeAt(0) + 1)
}

module.exports = {
    slash: true,
    testOnly: true,
    description: 'Créé un sondage dans le salon actuel',
    expectedArgs: '<question> <choix_a> <choix_b> <choix_c> <choix_d> <choix_e> <choix_f> <choix_g> <choix_h> <choix_i>',
    minArgs: 3,
    maxArgs: 10,
    callback: ({ message, channel, args }) => {
        const question = args.shift()
        const choix = args

        const embed = new MessageEmbed().setColor('#6d99d3').setTitle(question)

        let choix_icone = 'a'
        choix.forEach((elt) => {
            embed.addField('Choix :regional_indicator_' + choix_icone + ':', elt, true)
            choix_icone = nextChar(choix_icone)
        })

        const choix_regio = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮']
        setTimeout(() => {
            channel.send(embed).then(sentEmbed => {
                choix.forEach((elt, index) => {
                    sentEmbed.react(choix_regio[index])
                })
            })
        }, 50)


        return ':bar_chart: Sondage'
    },
}