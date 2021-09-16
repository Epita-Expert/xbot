module.exports = {
    isGlobal: false,
    data: {
        "name": "Karma",
        "type": "USER",
    },
    execute: async ({ options, interaction, channel }) => {
        await interaction.reply({ content: "Bientôt disponible...", ephemeral:true})
    }
}