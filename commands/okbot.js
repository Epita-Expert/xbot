module.exports = {
    isGlobal: false,
    data: {
        name: "Ok BOT",
        "type": "MESSAGE",
    },
    execute: async ({ channel, user, client, interaction }) => {
        let message = await channel.messages.fetch(interaction.targetId)
        //console.log(message)
        await interaction.reply({ content: 'Bientôt...', ephemeral: true })
    }
}