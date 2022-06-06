module.exports = {
  isGlobal: false,
  data: {
    name: "Silence",
    type: "MESSAGE",
  },
  execute: async ({ options, interaction, channel }) => {
    randomString = [
      "Ferme la",
      "Rho TG",
      "Super.",
      "Qui s'en fout ?",
      "Ferme ta gue*le",
      "Euuh... Silence ?",
      "Tu vas la fermer ta gue*le ?",
      "Cool ta vie.",
      "ok.",
      "Rien à foutre",
    ];
    await channel.messages
      .fetch(interaction.targetId)
      .then((message) =>
        message.reply(
          randomString[Math.floor(Math.random() * randomString.length)]
        )
      );
    await interaction.reply({
      content: "Une réponse salée a été formulée à votre interlocuteur.",
      ephemeral: true,
    });
  },
};
