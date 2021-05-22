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


const getAgenda = (guild) => {
    return guild.channels.cache.find(chan => chan.name === "📅-agenda")
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
                        "description": "Identifiant du message de l'événement (le paramètre 'nom' sera ignoré mais doit être renseigné)",
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
            const dateNow = new Date()

            const query14 = {
                date: {
                    $lte: date14.valueOf(),
                    $gt: date7.valueOf()
                },
                'send.0': false
            }
            const query7 = {
                date: {
                    $lte: date7.valueOf(),
                    $gt: date2.valueOf()
                },
                'send.1': false
            }
            const query2 = {
                date: {
                    $lte: date2.valueOf(),
                    $gt: date1.valueOf()
                },
                'send.2': false
            }
            const query1 = {
                date: {
                    $lte: date1.valueOf(),
                    $gt: dateNow.valueOf()
                },
                'send.3': false
            }
            const queries = {
                "2 semaines": query14,
                "1 semaine": query7,
                "48h": query2,
                "24h": query1
            }
            let index = 0
            for (const [name, query] of Object.entries(queries)) {
                const events = await agendaSchema.find(query)
                for (const event of events) {
                    const date = event.date
                    const [heure, minute, seconde] = date.toLocaleTimeString('fr-FR').split(':')
                    const temps = heure ? ' à ' + (minute ? heure + ':' + minute : heure + 'h') + ' ' : ''
                    event.subscribers.forEach((user) => {
                        let discordUser = client.users.cache.get(user)
                        if (discordUser) {
                            const embed = new MessageEmbed().setTitle("\""+event.name+"\" dans "+name+" - "+date.toLocaleDateString('fr-FR')+temps).setDescription(event.description || "Aucune description de l'événement").setAuthor('🔔 RAPPEL').setColor('#6d99d3')
                            embed.setFooter('🔔 Clique sur la cloche sous cet événement dans le salon agenda pour ne plus recevoir de rappels par message privé.')
                            discordUser.send(embed)
                        }
                    })
                    let updateField = `send.${index}`
                    let updatedEvent = await agendaSchema.findOneAndUpdate(
                        { msgId: event.msgId, channelId: event.channelId },
                        { [updateField]: true },
                        { useFindAndModify: false, new: true }
                    )
                    console.log("Reminder sent for \""+updatedEvent.name+"\" ("+name+")")
                }
                ++index
            }

            setTimeout(verifNotifs, 10000)
        }

        verifNotifs()


        client.on('messageReactionAdd', async (reaction, user) => {
            const agendaChannel = getAgenda(reaction.message.channel.guild)
            if(agendaChannel && reaction.message.channel.id === agendaChannel.id){
                if(reaction._emoji.name == "🔔" && !user.bot){
                    let event = await agendaSchema.findOneAndUpdate(
                        { msgId: reaction.message.id, channelId: reaction.message.channel.id },
                        { $push: { subscribers: user.id  } },
                        { useFindAndModify: false, new: true }
                    )
                    if (event) {
                        let dateNow = new Date()
                        let embed = null
                        if (dateNow > event.date) {
                            embed = new MessageEmbed().setTitle('Abonnement à l\'événement "'+ event.name +'" pris en compte').setDescription('Attention il semblerait que cet événement est déjà passé, tu ne receveras donc pas de rappels pour celui-ci.').setAuthor('🔔 Notifications xBot').setColor('#6d99d3')
                        } else {
                            embed = new MessageEmbed().setTitle('Abonnement à l\'événement "'+ event.name +'" pris en compte').setDescription('Tu receveras un rappel 2 semaines, 1 semaine, 48h et 24h avant l\'événement par message privé.').setAuthor('🔔 Notifications xBot').setColor('#6d99d3')
                        }
                        reaction.message.guild.members.cache.find(member => member.id === user.id).send(embed)
                    } else {
                        reaction.remove()
                    }
                }
            }
        })

        client.on('messageReactionRemove', async (reaction, user) => {
            const agendaChannel = getAgenda(reaction.message.channel.guild)
            if(agendaChannel && reaction.message.channel.id === agendaChannel.id){
                if(reaction._emoji.name == "🔔" && !user.bot){
                    let event = await agendaSchema.findOneAndUpdate(
                        { msgId: reaction.message.id, channelId: reaction.message.channel.id },
                        { $pull: { subscribers: user.id  } },
                        { useFindAndModify: false, new: true }
                    )
                    if (event) {
                        const embed = new MessageEmbed().setTitle('Désabonnement de l\'événement "'+ event.name +'" pris en compte').setDescription('Tu ne receveras plus aucun rappel par message privé pour cet événement.').setAuthor('🔔 Notifications xBot').setColor('#6d99d3')
                        reaction.message.guild.members.cache.find(member => member.id === user.id).send(embed)
                    }
                }
            }
        })
    },
    callback: async ({ channel, options, subcommands }) => {
        const agendaChannel = getAgenda(channel.guild)
        if (!agendaChannel)
            return "Aucun salon xBot agenda n'existe sur ce serveur. Créé-le ou demande à un administrateur de le créer. Le nom du salon doit être le suivant :```📅-agenda```"
        if (subcommands[0] === "ajouter") {
            if ( ([1,3,5,7,8,10,12].indexOf(options.mois) != -1 && options.jour > 31)
                || ([4,6,9,11].indexOf(options.mois) != -1 && options.jour > 30)
                || (options.mois === 2 && options.jour > 29)
                || options.jour < 1) {
                return 'Le jour sélectionné est invalide. Merci de réessayer.'
            }

            const date = ("0" + options.jour).slice(-2) + '/' + ("0" + options.mois).slice(-2) + '/' + options.annee
            const heure = options.heure ? ' à ' + (("0" + options.minute).slice(-2) ? ("0" + options.heure).slice(-2) + ':' + ("0" + options.minute).slice(-2) : ("0" + options.heure).slice(-2) + 'h') + ' ' : ''
            const nom = options.nom
            const description = options.description

            const embed = new MessageEmbed().setTitle(date + heure + ' - ' + nom).setDescription(description).setAuthor('📅 À venir').setColor('#6d99d3')

            embed.setFooter('🔔 Clique sur la cloche pour recevoir un rappel 2 semaines, 1 semaine, 48h et 24h avant l\'événement par message privé.')

            const datedb = new Date(options.annee + '-' + ("0" + options.mois).slice(-2) + '-' + ("0" + options.jour).slice(-2) + 'T' + (options.heure ? (("0" + options.minute).slice(-2) ? ("0" + options.heure).slice(-2) + ':' + ("0" + options.minute).slice(-2) : ("0" + options.heure).slice(-2) + ':00') + ':00' : '00:00:00'))

            agendaChannel.send(embed).then(sentEmbed => {
                sentEmbed.react('🔔')
                new agendaSchema({
                    date: datedb.valueOf(),
                    msgId: sentEmbed.id,
                    channelId: agendaChannel.id,
                    guildId: channel.guild.id,
                    name: nom,
                    description: description
                }).save()
            })

            return 'L\'événement a bien été ajouté dans <#' + agendaChannel.id + '>. Tu peux t\'abonner aux rappels en cliquant sur :bell: sous l\'événement.'
        } else if (subcommands[0] === "supprimer") {
            if ("nom" in options && !("id_message" in options)) {
                const events = await agendaSchema.find({
                    name: options.nom
                })
                if (events.length === 1) {
                    const event = events[0]
                    let success = false
                    await agendaSchema.deleteOne({msgId: event.msgId}).then(() => {
                        success = true
                        agendaChannel.messages.fetch(event.msgId).then(message => message.delete())
                    })
                    return success ? 'L\'événement a bien été supprimé de <#' + agendaChannel.id + '>.' : 'Erreur lors de la suppression'
                } else if(events.length === 0) {
                    return 'Aucun événement trouvé avec ce nom.'
                } else {
                    return 'Le nom de cet événement est ambigu, merci de préciser l\'identifiant du message à la place.'
                }
            } else if ("id_message" in options) {
                let success = false
                await agendaSchema.deleteOne({msgId: options.id_message}).then(() => {
                    success = true
                    agendaChannel.messages.fetch(options.id_message).then(message => message.delete())
                })
                return success ? 'L\'événement a bien été supprimé de <#' + agendaChannel.id + '>.' : 'Erreur lors de la suppression'
            } else {
                return 'Merci de renseigner un des deux paramètres.'
            }
        } else {
            return 'Erreur lors de l\'exécution de la commande...'
        }

    }
}