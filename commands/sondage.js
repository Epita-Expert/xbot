const { MessageEmbed } = require("discord.js");

const nextChar = (c) => {
  return String.fromCharCode(c.charCodeAt(0) + 1);
};

module.exports = {
  isGlobal: false,
  data: {
    name: "sondage",
    description:
      "Créé un sondage dans le salon actuel (jusqu'à 9 choix possibles !)",
    options: [
      {
        name: "question",
        description: "La question du sondage",
        type: "STRING",
        required: true,
      },
      {
        name: "choix_a",
        description: "Choix A",
        type: "STRING",
        required: true,
      },
      {
        name: "choix_b",
        description: "Choix B",
        type: "STRING",
        required: true,
      },
      {
        name: "choix_c",
        description: "Choix C",
        type: "STRING",
        required: false,
      },
      {
        name: "choix_d",
        description: "Choix D",
        type: "STRING",
        required: false,
      },
      {
        name: "choix_e",
        description: "Choix E",
        type: "STRING",
        required: false,
      },
      {
        name: "choix_f",
        description: "Choix F",
        type: "STRING",
        required: false,
      },
      {
        name: "choix_g",
        description: "Choix G",
        type: "STRING",
        required: false,
      },
      {
        name: "choix_h",
        description: "Choix H",
        type: "STRING",
        required: false,
      },
      {
        name: "choix_i",
        description: "Choix I",
        type: "STRING",
        required: false,
      },
    ],
  },
  execute: async ({ channel, options, interaction }) => {
    const question = options.getString("question");
    const embed = new MessageEmbed().setColor("#6d99d3").setTitle(question);
    const choix_regio = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮"];
    const choix = [];
    let letter = "a";
    for (i = 0; i < choix_regio.length; ++i) {
      const val = options.getString("choix_" + letter);
      if (val) choix.push(val);
      letter = nextChar(letter);
    }

    choix.forEach((elt, index) => {
      embed.addField(choix_regio[index], elt, true);
    });

    await interaction.reply({
      content: ":bar_chart: Sondage",
      embeds: [embed],
    });
    const message = await interaction.fetchReply();
    choix.forEach((elt, index) => {
      message.react(choix_regio[index]);
    });
  },
};
