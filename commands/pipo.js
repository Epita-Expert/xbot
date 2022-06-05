const pipotron = require("pipotron");

module.exports = {
  isGlobal: false,
  data: {
    name: "pipo",
    description: "Pipote une phrase corporate pour vos meilleurs calls",
    options: [],
  },
  execute: async ({ interaction }) => {
    await interaction.reply({ content: pipotron() });
  },
};
