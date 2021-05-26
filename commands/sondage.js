const { MessageEmbed } = require('discord.js')

const nextChar = (c) => {
    return String.fromCharCode(c.charCodeAt(0) + 1)
}

module.exports.sondage = {
    isGlobal: false,
    data: {
        "name": "sondage",
        "description": "Créé un sondage dans le salon actuel (jusqu'à 9 choix possibles !)",
        "options": [
            {
                "name": "question",
                "description": "La question du sondage",
                "type": 3,
                "required": true
            },
            {
                "name": "choix_a",
                "description": "Choix A",
                "type": 3,
                "required": true
            },
            {
                "name": "choix_b",
                "description": "Choix B",
                "type": 3,
                "required": true
            },
            {
                "name": "choix_c",
                "description": "Choix C",
                "type": 3,
                "required": false
            },
            {
                "name": "choix_d",
                "description": "Choix D",
                "type": 3,
                "required": false
            },
            {
                "name": "choix_e",
                "description": "Choix E",
                "type": 3,
                "required": false
            },
            {
                "name": "choix_f",
                "description": "Choix F",
                "type": 3,
                "required": false
            },
            {
                "name": "choix_g",
                "description": "Choix G",
                "type": 3,
                "required": false
            },
            {
                "name": "choix_h",
                "description": "Choix H",
                "type": 3,
                "required": false
            },
            {
                "name": "choix_i",
                "description": "Choix I",
                "type": 3,
                "required": false
            }
        ]
    },
    callback: ({ channel, options }) => {
        options = Object.values(options)
        const question = options.shift()
        const choix = options
        const embed = new MessageEmbed().setColor('#6d99d3').setTitle(question)
        const choix_regio = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮']

        choix.forEach((elt, index) => {
            embed.addField(choix_regio[index], elt, true)
        })

        setTimeout(() => {
            channel.send(embed).then(sentEmbed => {
                choix.forEach((elt, index) => {
                    sentEmbed.react(choix_regio[index])
                })
            })
        }, 75)

        return ':bar_chart: Sondage'
    }
}