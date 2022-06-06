module.exports = {
  isGlobal: false,
  data: {
    name: "statut",
    description: "Change le statut du bot xBot",
    options: [
      {
        name: "type",
        description: "Le type de statut",
        type: "STRING",
        required: true,
        choices: [
          {
            name: "Regarde (WATCHING)",
            value: "WATCHING",
          },
          {
            name: "Participant à : (COMPETING)",
            value: "COMPETING",
          },
          {
            name: "Joue à (PLAYING)",
            value: "PLAYING",
          },
          {
            name: "Écoute (LISTENING)",
            value: "LISTENING",
          },
          {
            name: "Joue à (STREAMING)",
            value: "STREAMING",
          },
        ],
      },
      {
        name: "message",
        description: "Le message de statut du bot",
        type: "STRING",
        required: true,
      },
    ],
    defaultPermission: false,
    permissions: [
      {
        id: "270616722971688971",
        type: "USER",
        permission: true,
      },
    ],
  },
  execute: async ({ options, channel, user, client, interaction }) => {
    let statut = options.getString("message");
    let type = options.getString("type");
    if (statut.length <= 64) {
      client.user.setActivity(statut, { type: type });
      await interaction.reply({
        content: "Tu as modifié le statut du bot.",
        ephemeral: true,
      });
    } else {
      throw "status string is too long (more than 64 characters)";
    }
  },
};
