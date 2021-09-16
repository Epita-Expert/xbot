const alexa = require("alexa-bot-api");
const ai = new alexa();

module.exports = {
    isGlobal: false,
    data: {
        name: "Ok BOT",
        "type": "MESSAGE",
    },
    execute: async ({ channel, user, client, interaction }) => {
        let message = await channel.messages.fetch(interaction.targetId)
        //console.log(message)
        //const reply = await ai.getReply("Comment ça va ?", "french");

        //console.log(reply);
        await interaction.reply({ content: 'Bientôt...', ephemeral: true })
    }
}