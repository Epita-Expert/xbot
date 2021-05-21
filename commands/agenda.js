const { MessageEmbed } = require('discord.js')

//const scheduledSchema = require('../models/agenda-schema')

const annee = []
let d = new Date()
y = d.getFullYear()
for (i = 0; i < 3; ++i) {
    annee.push({name: (y+i).toString(), value:(y+i)})
}

const heure = []
for (i = 0; i < 24; ++i) {
    heure.push({name: ("0" + i).slice(-2), value:i})
}

const minute = []
for (i = 0; i < 60; i+=5) {
    minute.push({name: ("0" + i).slice(-2), value:i})
}

module.exports.agenda = {
    isGlobal: false,
    data: {
        "name": "agenda",
        "description": "Ajoute un événement dans le salon Agenda, il est possible de s'abonner aux événements",
        "options": [
            {
                "name": "nom",
                "description": "Nom de l'événement",
                "type": 3,
                "required": true
            },
            {
                "name": "description",
                "description": "Description de l'événement",
                "type": 3,
                "required": true
            },
            {
                "name": "jour",
                "description": "Jour de l'événement (format JJ)",
                "type": 4,
                "required": true
            },
            {
                "name": "mois",
                "description": "Mois de l'événement",
                "type": 4,
                "required": true,
                "choices": [
                    {
                        "name": "Janvier",
                        "value": 1
                    },
                    {
                        "name": "Février",
                        "value": 2
                    },
                    {
                        "name": "Mars",
                        "value": 3
                    },
                    {
                        "name": "Avril",
                        "value": 4
                    },
                    {
                        "name": "Mai",
                        "value": 5
                    },
                    {
                        "name": "Juin",
                        "value": 6
                    },
                    {
                        "name": "Juillet",
                        "value": 7
                    },
                    {
                        "name": "Août",
                        "value": 8
                    },
                    {
                        "name": "Septembre",
                        "value": 9
                    },
                    {
                        "name": "Octobre",
                        "value": 10
                    },
                    {
                        "name": "Novembre",
                        "value": 11
                    },
                    {
                        "name": "Décembre",
                        "value": 12
                    }
                ]
            },
            {
                "name": "annee",
                "description": "Année de l'événement",
                "type": 4,
                "required": true,
                "choices": annee
            },
            {
                "name": "heure",
                "description": "(Optionnel) Heure de l'événement",
                "type": 4,
                "required": false,
                "choices": heure
            },
            {
                "name": "minute",
                "description": "(Optionnel) Minute de l'événement",
                "type": 4,
                "required": false,
                "choices": minute
            }
        ]
    },
    callback: ({ channel, options }) => {
        if ( ([1,3,5,7,8,10,12].indexOf(options.mois) != -1 && options.jour > 31)
            || ([4,6,9,11].indexOf(options.mois) != -1 && options.jour > 30)
            || (options.mois === 2 && options.jour > 29)
            || options.jour < 1) {
            return 'Le jour sélectionné est invalide. Merci de réessayer.'
        }

        const date = ("0" + options.jour).slice(-2) + '/' + ("0" + options.mois).slice(-2) + '/' + options.annee
        const heure = options.heure ? ' à ' + (options.minute ? options.heure + ':' + options.minute : options.heure + 'h') + ' ' : ''
        const nom = options.nom
        const description = options.description

        const embed = new MessageEmbed().setTitle(date + heure + ' - ' + nom).setDescription(description).setAuthor('📅 À venir').setColor('#6d99d3')

        embed.setFooter('🔔 Clique sur la cloche pour recevoir un rappel 2 sem., 1 sem., 48h et 24h avant l\'événement par message privé.')

        channel.guild.channels.cache.get(process.env.AGENDA_ID).send(embed).then(sentEmbed => {
            sentEmbed.react('🔔')
        })

        return 'L\'événement a bien été ajouté dans <#' + process.env.AGENDA_ID + '>. Tu peux t\'abonner aux rappels en cliquant sur :bell: sous l\'événement.'
    }
}