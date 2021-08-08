const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    isGlobal: false,
    data: {
        "name": "shifumi",
        "description": "Joue au Pierre-Feuille-Ciseaux",
        "options": [
            {
                "name": "bot",
                "description": "Défi le bot au Pierre-Feuille-Ciseaux",
                "type": 'SUB_COMMAND',
                "options": [
                    {
                        "name": "signe",
                        "description": "Signe Shifumi",
                        "type": 'STRING',
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
                "type": 'SUB_COMMAND',
                "options": [
                    {
                        "name": "utilisateur",
                        "description": "Nom de l'utilisateur à défier",
                        "type": 'USER',
                        "required": true
                    }
                ]
            }
        ]
    },
    execute: async ({ interaction, channel, options, user, client }) => {
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
        if (options.getSubcommand() === "bot") {
            const userSign = options.getString('signe')
            const signsList = Object.keys(signs)
            const botSign = signsList[Math.floor(Math.random() * signsList.length)]
            let sentence = ''
            if (botSign === userSign) {
                sentence = '**On dirait bien une égalité.**'
            } else if (signs[botSign].beat === userSign) {
                sentence = '**xBot a gagné !**'
            } else {
                sentence = '**Tu as gagné, bien joué...**'
            }
            await interaction.reply({content: 'Tu as défié <@'+client.user.id+'> au **shifumi** !\n\n'+signs[userSign].icon + " *toi*  **VS**  " + signs[botSign].icon + " *bot*\n" + sentence})
        } else {
            const player1 = user.id
            const userObj = options.getUser('utilisateur')
            const player2 = userObj.id
            if (player2 === client.user.id) {
                return 'Pour jouer contre le bot, utilise la commande : ```/shifumi bot```'
            } else if (user.id == player2 || userObj.bot) {
                return 'Impossible de jouer contre soi-même ou contre un bot...'
            }
            const reponse = '<@'+player2+'>, tu as été défié au **shifumi** par <@'+player1+'> !\n\nFais ton choix :'
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('pierre')
                        .setLabel('👊 Pierre')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('feuille')
                        .setLabel('✋ Feuille')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('ciseaux')
                        .setLabel('✌ Ciseaux')
                        .setStyle('SECONDARY')
                );
            await interaction.reply({content: reponse, components: [row]})
            const message = await interaction.fetchReply()
            const collector = message.createMessageComponentCollector({ time: 15000 });
            let player1_choice = null
            let player2_choice = null

            collector.on('collect', async i => {
                if (player1_choice && player2_choice) {
                    return
                }
                if ((i.user.id === player1 || i.user.id === player2) && i.customId in signs) {
                    if (i.user.id === player1 && !player1_choice) {
                        player1_choice = i.customId
                        await i.reply({content: 'Tu as sélectionné "'+i.customId+'".', ephemeral: true})
                    } else if (i.user.id === player2 && !player2_choice) {
                        player2_choice = i.customId
                        await i.reply({content: 'Tu as sélectionné "'+i.customId+'".', ephemeral: true})
                    }
                    if (player1_choice && player2_choice) {
                        let sentence = ''
                        if (player1_choice === player2_choice) {
                            sentence = '**On dirait bien une égalité.**'
                        } else if (signs[player1_choice].beat === player2_choice) {
                            sentence = '**<@'+player1+'> a gagné !**'
                        } else {
                            sentence = '**<@'+player2+'> a gagné !**'
                        }
                        await interaction.followUp(signs[player1_choice].icon + " *<@"+player1+">*  **VS**  " + signs[player2_choice].icon + " *<@"+player2+">*\n" + sentence)
                        await interaction.editReply({content: '<@'+player2+'>, tu as été défié au **shifumi** par <@'+player1+'> !\n\nPartie terminée.', components: []})
                    }
                }
            })

            collector.on('end', async collected => {
                if (!player1_choice || !player2_choice) {
                    let response = ''
                    if (player1_choice) {
                        response = '<@'+player2+'> a mis trop de temps à réagir.'
                    } else if (player2_choice) {
                        response = '<@'+player1+'> a mis trop de temps à réagir.'
                    } else {
                        response = '<@'+player2+'> et <@'+player1+'>, vous avez mis trop de temps à réagir.'
                    }
                    await interaction.followUp(response)
                    await interaction.editReply({content: '<@'+player2+'>, tu as été défié au **shifumi** par <@'+player1+'> !\n\nPartie terminée.', components: []})
                }
            })
        }
    }
}