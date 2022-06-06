const Minesweeper = require("discord.js-minesweeper");

module.exports = {
  isGlobal: false,
  data: {
    name: "demineur",
    description: "Joue au Démineur",
    options: [],
  },
  execute: async ({ options, interaction }) => {
    let rows = 9;
    let columns = 9;
    let mines = 10;
    let diff = "Débutant";
    const minesweeper = new Minesweeper({ rows, columns, mines });
    let matrix = minesweeper.start();
    if (matrix) {
      matrix = matrix.replace(/\|\| /g, "||");
      matrix = matrix.replace(/ \|\|/g, "||");
      matrix = matrix.replace(/\|\|\|\|/g, "|| ||");
    }
    await interaction.reply({
      content: matrix
        ? ":boom: **DÉMINEUR** - *Difficulté : " +
          diff +
          " (" +
          rows +
          "x" +
          columns +
          " - " +
          mines +
          " mines)*"
        : ":warning: Une erreur est survenue...",
    });
    await interaction.followUp(matrix);
  },
};
