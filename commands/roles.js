const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    isGlobal: false,
    guilds: ["761233808645029888"],
    data: {
        "name": "roles",
        "description": "Affiche l'UI de gestion des rôles",
        "options": [],
        "defaultPermission": false,
        "permissions": [
            {
                id: '270616722971688971',
                type: 'USER',
                permission: true,
            },
        ],
    },
    execute: async ({interaction}) => {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('joueur')
                    .setLabel('🎮 Joueur')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('apero')
                    .setLabel('🍹 Apéro')
                    .setStyle('SECONDARY'),
            );
        await interaction.reply({
            "content": null,
            "components": [row],
            "embeds": [
                {
                    "title": "Gestion des rôles  🔖",
                    "description": "Clique sur les boutons ci-dessous pour ajouter/retirer le rôle.",
                    "color": 7182803,
                    "fields": [
                        {
                            "name": "🎮 Joueur",
                            "value": "Ce rôle donne accès à une sélection de salons dédiés au jeu (vocaux et textuels)."
                        },
                        {
                            "name": "🍹 Apéro",
                            "value": "Ce rôle permet d'être notifié lorsque le rôle est mentionné, notamment en cas d'organisation d'un apéro ou d'une sortie."
                        }
                    ]
                }
            ]
        })
    },
    callback: async ({interaction, user, channel}) => {
        const roles = {
            joueur: '789609159510327346',
            apero: '887745700710998048'
        }
        if (!(interaction.customId in roles)) {
            throw "Rôle invalide"
        }
        const roleId = roles[interaction.customId]
        const role = interaction.guild.roles.cache.find(role => role.id === roleId)
        if (user.roles.cache.has(roleId)) {
            user.roles.remove(role)
            await interaction.reply({ content: 'Le rôle "'+interaction.customId+'" a bien été retiré de ton profil.', ephemeral: true })
        } else {
            user.roles.add(role)
            await interaction.reply({ content: 'Le rôle "'+interaction.customId+'" a bien été ajouté à ton profil.', ephemeral: true })
        }
    }
}