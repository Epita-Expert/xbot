const {MessageActionRow, MessageButton} = require('discord.js')

module.exports = {
    isGlobal: false,
    data: {
        "name": "Pierre-papier-ciseaux",
        "type": "USER",
    },
    execute: async ({interaction, channel, options, user, client}) => {
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
        const player1 = user.id
        const userObj = channel.guild.members.cache.get(interaction.targetId)
        const player2 = userObj.id
        if (user.id == player2 || (userObj.bot && player2 !== client.user.id)) {
            await interaction.reply({ content: 'Impossible de jouer contre soi-même ou contre un bot...', ephemeral:true})
            return;
        }
        const reponse = '<@' + player2 + '>, tu as été défié au **shifumi** par <@' + player1 + '> !\n\nFais ton choix :'
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
        const collector = message.createMessageComponentCollector({time: 15000});
        const signsList = Object.keys(signs)
        let botSign = null
        if (player2 === client.user.id) {
            botSign = signsList[Math.floor(Math.random() * signsList.length)]
        }
        let player1_choice = null
        let player2_choice = player2 === client.user.id ? botSign : null

        collector.on('collect', async i => {
            if (player1_choice && player2_choice) {
                return
            }
            if ((i.user.id === player1 || i.user.id === player2) && i.customId in signs) {
                if (i.user.id === player1 && !player1_choice) {
                    player1_choice = i.customId
                    await i.reply({content: 'Tu as sélectionné "' + i.customId + '".', ephemeral: true})
                } else if (i.user.id === player2 && !player2_choice) {
                    player2_choice = i.customId
                    await i.reply({content: 'Tu as sélectionné "' + i.customId + '".', ephemeral: true})
                }
                if (player1_choice && player2_choice) {
                    let sentence = ''
                    if (player1_choice === player2_choice) {
                        sentence = '**On dirait bien une égalité.**'
                    } else if (signs[player1_choice].beat === player2_choice) {
                        sentence = '**<@' + player1 + '> a gagné !**'
                    } else {
                        sentence = '**<@' + player2 + '> a gagné !**'
                    }
                    //await interaction.followUp(signs[player1_choice].icon + " *<@" + player1 + ">*  **VS**  " + signs[player2_choice].icon + " *<@" + player2 + ">*\n" + sentence)
                    await interaction.editReply({
                        content: '<@' + player2 + '>, tu as été défié au **shifumi** par <@' + player1 + '> !\n\n'+signs[player1_choice].icon + " *<@" + player1 + ">*  **VS**  " + signs[player2_choice].icon + " *<@" + player2 + ">*\n" + sentence,
                        components: []
                    })
                }
            }
        })

        collector.on('end', async collected => {
            if (!player1_choice || !player2_choice) {
                let response = ''
                if (player1_choice) {
                    response = '<@' + player2 + '> a mis trop de temps à réagir.'
                } else if (player2_choice) {
                    response = '<@' + player1 + '> a mis trop de temps à réagir.'
                } else {
                    response = '<@' + player2 + '> et <@' + player1 + '>, vous avez mis trop de temps à réagir.'
                }
                //await interaction.followUp(response)
                await interaction.editReply({
                    content: '<@' + player2 + '>, tu as été défié au **shifumi** par <@' + player1 + '> !\n\n'+response,
                    components: []
                })
            }
        })
    }
}