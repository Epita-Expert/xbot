module.exports.shifumi = {
    isGlobal: false,
    data: {
        "name": "shifumi",
        "description": "Joue au Pierre-Feuille-Ciseaux",
        "options": [
            {
                "name": "bot",
                "description": "Défi le bot au Pierre-Feuille-Ciseaux",
                "type": 1,
                "options": [
                    {
                        "name": "signe",
                        "description": "Signe Shifumi",
                        "type": 3,
                        "required": true,
                        "choices": [
                            {
                                "name": "👊 Pierre",
                                "value": "pierre"
                            },
                            {
                                "name": "✋ Feuille",
                                "value": "feuille"
                            },
                            {
                                "name": "✌️ Ciseaux",
                                "value": "ciseaux"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "vs",
                "description": "Défi un utilisateur au Pierre-Feuille-Ciseaux",
                "type": 1,
                "options": [
                    {
                        "name": "utilisateur",
                        "description": "Nom de l'utilisateur à défier",
                        "type": 6,
                        "required": true
                    }
                ]
            }
        ]
    },
    callback: async ({ channel, options, user, subcommands, client }) => {
        const signs = {
            pierre: {
                beat: 'ciseaux',
                icon: '👊'
            },
            feuille: {
                beat: 'pierre',
                icon: '✋'
            },
            ciseaux: {
                beat: 'feuille',
                icon: '✌'
            }
        }
        if (subcommands[0] === "bot") {
            const userSign = options.signe
            const signsList = Object.keys(signs)
            const botSign = signsList[Math.floor(Math.random() * signsList.length)]
            let sentence = ''
            if (botSign === userSign) {
                sentence = '**On dirait bien une égalité.**'
            } else if (signs[botSign].beat === userSign) {
                sentence = '**J\'ai gagné !**'
            } else {
                sentence = '**Tu as gagné, bien joué...**'
            }
            return signs[userSign].icon + " vs " + signs[botSign].icon + "\n" + sentence
        } else {
            const player1 = user.id
            const player2 = options.utilisateur
            const userObj = await client.users.fetch(player2)
            if (player2 === client.user.id) {
                return 'Pour jouer contre le bot, utilise la commande : ```/shifumi bot```'
            } else if (user.id == player2 || userObj.bot) {
                return 'Impossible de jouer contre soi-même ou contre un bot...'
            }
            const reponse = '👊-✋-✌ **SHIFUMI** 👊-✋-✌\n<@'+player2+'> tu as été défié au shifumi par <@'+player1+'> !\n\nRéagissez tous les deux à ce message avec le signe de votre choix.'
            setTimeout(() => {
                let targetChan = channel
                channel.messages.fetch({ limit: 10 }).then(messages => {
                    let lastMessage = messages.filter(msg => (msg.author.id === client.user.id && msg.content == reponse)).first()

                    if (lastMessage) {
                        const signReactions = Object.entries(signs).map((val) => {
                            return val[1].icon
                        })
                        signReactions.forEach((r)=>{
                            lastMessage.react(r)
                        })

                        const filter = (reaction, user) => {
                            return true
                        }

                        const collector = lastMessage.createReactionCollector(filter, { time: 15000 })
                        let player1_choice = null
                        let player2_choice = null

                        collector.on('collect', (reaction, user) => {
                            if (user.id === client.user.id || (player1_choice && player2_choice)) {
                                return
                            }
                            if ((user.id === player1 || user.id === player2) && signReactions.indexOf(reaction.emoji.name) > -1) {
                                if (user.id === player1 && !player1_choice) {
                                    player1_choice = reaction.emoji.name
                                } else if (user.id === player2 && !player2_choice) {
                                    player2_choice = reaction.emoji.name
                                }
                                reaction.users.remove(user.id)
                                if (player1_choice && player2_choice) {
                                    const player1_text = Object.entries(signs).filter((val) => {
                                        return val[1].icon === player1_choice
                                    })[0][0]
                                    const player2_text = Object.entries(signs).filter((val) => {
                                        return val[1].icon === player2_choice
                                    })[0][0]
                                    let sentence = ''
                                    if (player1_text === player2_text) {
                                        sentence = '**On dirait bien une égalité.**'
                                    } else if (signs[player1_text].beat === player2_text) {
                                        sentence = '**<@'+player1+'> a gagné !**'
                                    } else {
                                        sentence = '**<@'+player2+'> a gagné !**'
                                    }
                                    channel.send(signs[player1_text].icon + " vs " + signs[player2_text].icon + "\n" + sentence)
                                    lastMessage.reactions.removeAll()
                                }
                            } else {
                                reaction.users.remove(user.id)
                            }
                        })

                        collector.on('end', collected => {
                            if (!player1_choice || !player2_choice) {
                                if (player1_choice) {
                                    channel.send('👊-✋-✌ **SHIFUMI** 👊-✋-✌\n<@'+player2+'> a mis trop de temps à réagir.')
                                } else if (player2_choice) {
                                    channel.send('👊-✋-✌ **SHIFUMI** 👊-✋-✌\n<@'+player1+'> a mis trop de temps à réagir.')
                                } else {
                                    channel.send('👊-✋-✌ **SHIFUMI** 👊-✋-✌\n<@'+player2+'> et <@'+player1+'>, vous avez mis trop de temps à réagir.')
                                }
                            }
                            lastMessage.reactions.removeAll()
                        })
                    }
                })
            }, 150)
            return reponse
        }
    }
}