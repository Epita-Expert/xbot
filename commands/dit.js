module.exports = {
  isGlobal: false,
  data: {
    name: "dit",
    description: "Fait parler le bot à ta place dans ce salon ou ailleurs",
    options: [
      {
        name: "message",
        description: "Le message que le bot enverra anonymement à ta place",
        type: "STRING",
        required: true,
      },
      {
        name: "salon",
        description:
          "(Optionnel) Choisis un salon où envoyer ton message, par défaut dans le salon actuel",
        type: "CHANNEL",
        required: false,
      },
    ],
  },
  execute: async ({ options, channel, user, client, interaction }) => {
    let message = options.getString("message");
    let salon = options.getChannel("salon");
    let targetChan = salon ? salon : channel;
    targetChan.send(message);
    console.log(
      user.username +
        " (id:" +
        user.id +
        ") used the bot to say '" +
        message +
        "' (in:" +
        targetChan.id +
        ")"
    );
    await interaction.reply({
      content:
        'Tu as utilisé le bot pour dire : "' +
        (message.length > 32 ? `${message.substring(0, 32)}...` : message) +
        '" dans <#' +
        targetChan.id +
        ">.",
      ephemeral: true,
    });
  },
};
