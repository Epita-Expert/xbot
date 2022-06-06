const BlaguesAPI = require("blagues-api");

module.exports = {
  isGlobal: false,
  data: {
    name: "blague",
    description:
      "Raconte les meilleures blagues sur le thème de l'informatique (ou autre...)",
    options: [
      {
        name: "type",
        description: "(Optionnel) Type de blagues - par défaut dev",
        type: "STRING",
        required: false,
        choices: [
          {
            name: "Toutes",
            value: "GLOBAL",
          },
          {
            name: "Dev",
            value: "DEV",
          },
          {
            name: "Humour noir",
            value: "DARK",
          },
          {
            name: "Beauf",
            value: "BEAUF",
          },
          {
            name: "Blondes",
            value: "BLONDES",
          },
        ],
      },
    ],
  },
  execute: async ({ options, interaction }) => {
    const type = options.getString("type");
    const blagues = new BlaguesAPI(process.env.BLAGUES_TOKEN);
    const json = await blagues.randomCategorized(
      type ? blagues.categories[type] : blagues.categories.DEV
    );
    await interaction.reply({
      content:
        "**" + json.joke + "**" + (json.answer ? "\n" + json.answer : ""),
    });
  },
};
