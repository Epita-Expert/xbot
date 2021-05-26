const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

module.exports.bescherelle = {
    isGlobal: false,
    data: {
        "name": "bescherelle",
        "description": "Propose une correction orthographique sur le dernier message d'une personne",
        "options": [
            {
                "name": "utilisateur",
                "description": "Nom de l'utilisateur à corriger",
                "type": 6,
                "required": true
            },
            {
                "name": "langue",
                "description": "Langue de la correction (Français par défaut)",
                "type": 3,
                "required": false,
                "choices": [
                    {
                        "name": "Français",
                        "value": "fr"
                    },
                    {
                        "name": "Anglais",
                        "value": "en"
                    },
                    {
                        "name": "Allemand",
                        "value": "de"
                    },
                    {
                        "name": "Espagnol",
                        "value": "es"
                    },
                    {
                        "name": "Japonais",
                        "value": "ja"
                    }
                ]
            }
        ]
    },
    callback: async ({ channel, options, client }) => {
        let reponse = 'Une erreur est survenue. :/'
        const auteur = options.utilisateur
        if (auteur === client.user.id) {
            return 'https://fr.wikipedia.org/wiki/Récursivité'
        }
        const lang = options.langue || 'fr'
        await channel.messages.fetch({ limit: 25 }).then(async messages => {
            let lastMessage = messages.filter(msg => (msg.author.id === auteur && msg.content)).first()
            if (lastMessage) {
                const phrase = lastMessage.content.trim()
                const finalPoint = (phrase.slice(-1) === '.')
                const bescherelle = await fetch('http://localhost:17777/v2/check?language='+lang+'&text=' + encodeURIComponent(phrase)).then(response => response.json())
                if (bescherelle && "matches" in bescherelle) {
                    if (bescherelle.matches.length) {
                        const embed = new MessageEmbed().setColor('#6d99d3')
                        let correct = phrase
                        bescherelle.matches.forEach((match) => {
                            embed.addField(correct.slice(match.offset, match.offset + match.length) + " ➡️ **"+match.replacements[0].value+"**", match.message)
                            correct = correct.slice(0, match.offset) + match.replacements[0].value + correct.slice(match.offset + match.length, correct.length)
                        })
                        correct += (finalPoint ? '' : '.')
                        embed.setTitle('"' + correct + '"')
                        if (!finalPoint) {
                            embed.setFooter('Et évidemment, on n\'oublie pas le point en fin de phrase. 😉')
                        }
                        reponse = 'Voici quelques remarques grammaticales et orthographiques :'
                        setTimeout(() => {
                            channel.send(embed)
                        }, 75)
                    } else {
                        reponse = 'J\'ai déjà vu pire ! Il n\'y a pas de fautes flagrantes dans ce message. 😁' || 'Excepté l\'absence de point final je ne vois rien de choquant.'
                    }
                } else {
                    reponse = 'Vérification orthographique impossible. :('
                }
                reponse = '*<@'+ auteur +'> a dit :*\n> '+ phrase +'\n\n' + reponse
            } else {
                reponse = 'Aucun message de cet utilisateur n\'a été trouvé dans les derniers messages.'
            }
        })
        return reponse
    }
}