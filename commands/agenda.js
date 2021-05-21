const { MessageEmbed } = require('discord.js')

const agendaSchema = require('../models/agenda-schema')

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
        "description": "Gestion des événements du salon Agenda, il est possible de s'abonner aux rappels des événements",
        "options": [
            {
                "name": "ajouter",
                "description": "Ajoute un événement",
                "type": 1,
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
            {
                "name": "supprimer",
                "description": "Supprime un événement (Spécifier un des deux paramètres)",
                "type": 1,
                "options": [
                    {
                        "name": "nom",
                        "description": "Nom de l'événement",
                        "type": 3,
                        "required": false
                    },
                    {
                        "name": "id_message",
                        "description": "Identifiant du message de l'événement",
                        "type": 3,
                        "required": false
                    }
                ]
            }
        ]
    },
    init: ({ client }) => {
        const verifNotifs = async () => {
            const date14 = new Date()
            date14.setDate(date14.getDate() + 14)
            const date7 = new Date()
            date7.setDate(date7.getDate() + 7)
            const date2 = new Date()
            date2.setDate(date2.getDate() + 2)
            const date1 = new Date()
            date1.setDate(date1.getDate() + 1)

            const query14 = {
                date: {
                    $lte: date14.valueOf(),
                    $gt: date7.valueOf()
                },
                'send.0': false,
                subscribers: { $exists: true, $ne: [] }
            }
            const events14 = await agendaSchema.find(query14)
            /*for (const event of events14) {
                event.subscribers.forEach((user) => {
                    let discordUser = client.users.cache.get(user)
                    if (discordUser)
                        discordUser.send("notif j-14 pour " + event.name + " " + event.date.toString())
                })
            }*/
            const query7 = {
                date: {
                    $lte: date7.valueOf(),
                    $gt: date2.valueOf()
                },
                'send.1': false,
                subscribers: { $exists: true, $ne: [] }
            }
            const events7 = await agendaSchema.find(query7)
            /*for (const event of events7) {
                event.subscribers.forEach((user) => {
                    let discordUser = client.users.cache.get(user)
                    if (discordUser)
                        discordUser.send("notif j-7 pour " + event.name)
                })
            }*/

            setTimeout(verifNotifs, 10000)
        }

        verifNotifs()


        client.on('messageReactionAdd', async (reaction, user) => {
            if(reaction.message.channel.id === process.env.AGENDA_ID){
                if(reaction._emoji.name == "🔔" && !user.bot){
                    let event = await agendaSchema.findOneAndUpdate(
                        { msgId: reaction.message.id, channelId: reaction.message.channel.id },
                        { $push: { subscribers: user.id  } },
                        { useFindAndModify: false, new: true }
                    )
                    const embed = new MessageEmbed().setTitle('Abonnement à l\'événement "'+ event.name +'" pris en compte').setDescription('Tu receveras un rappel 2 semaines, 1 semaine, 48h et 24h avant l\'événement par message privé.').setAuthor('🔔 Notifications xBot').setColor('#6d99d3')
                    reaction.message.guild.members.cache.find(member => member.id === user.id).send(embed)
                }
            }
        })

        client.on('messageReactionRemove', async (reaction, user) => {
            if(reaction.message.channel.id === process.env.AGENDA_ID){
                if(reaction._emoji.name == "🔔" && !user.bot){
                    let event = await agendaSchema.findOneAndUpdate(
                        { msgId: reaction.message.id, channelId: reaction.message.channel.id },
                        { $pull: { subscribers: user.id  } },
                        { useFindAndModify: false, new: true }
                    )
                    const embed = new MessageEmbed().setTitle('Désabonnement de l\'événement "'+ event.name +'" pris en compte').setDescription('Tu ne receveras plus aucun rappel par message privé pour cet événement.').setAuthor('🔔 Notifications xBot').setColor('#6d99d3')
                    reaction.message.guild.members.cache.find(member => member.id === user.id).send(embed)
                }
            }
        })
    },
    callback: ({ channel, options, subcommands }) => {
        if (subcommands[0] === "ajouter") {
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

            embed.setFooter('🔔 Clique sur la cloche pour recevoir un rappel 2 semaines, 1 semaine, 48h et 24h avant l\'événement par message privé.')

            const datedb = new Date(options.annee + '-' + ("0" + options.mois).slice(-2) + '-' + ("0" + options.jour).slice(-2) + 'T' + (options.heure ? (options.minute ? options.heure + ':' + options.minute : options.heure + ':00') + ':00' : '00:00:00'))
            datedb.setHours(datedb.getHours() + (datedb.getTimezoneOffset()/60)*-1);

            channel.guild.channels.cache.get(process.env.AGENDA_ID).send(embed).then(sentEmbed => {
                sentEmbed.react('🔔')
                new agendaSchema({
                    date: datedb.valueOf(),
                    msgId: sentEmbed.id,
                    channelId: process.env.AGENDA_ID,
                    guildId: channel.guild.id,
                    name: nom
                }).save()
            })

            return 'L\'événement a bien été ajouté dans <#' + process.env.AGENDA_ID + '>. Tu peux t\'abonner aux rappels en cliquant sur :bell: sous l\'événement.'
        } else if (subcommands[0] === "supprimer") {
            return 'Suppression indisponible'
        } else {
            return 'Erreur lors de l\'exécution de la commande...'
        }

    }
}