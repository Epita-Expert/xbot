function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  isGlobal: false,
  data: {
    name: "tarot",
    description: "Pose une question, le bot piochera une carte pour toi",
    options: [
      {
        name: "question",
        description: "La question à poser",
        type: "STRING",
        required: true,
      },
    ],
  },
  execute: async ({ interaction, options }) => {
    randomString = [
      "0. Le Nouveau : \nC'est le debut d'une nouvelle aventure. Vous avancez insouciant, sur une route remplie d'opportunités et d'embuches.",
      "I. Le Savant Fou : \nSa volonté est capable de tout, comme de passer la moulinette avec une boucle infinie.",
      "II. La Weed : \nRapprochez-vous de votre inconscient.",
      "III. La Reponsable Pédagogique : \nLa nature protectrice de cette personne développera vos compétences PowerPoint.",
      "IV. Le Directeur : \nIl dirige son école d'une main de fer et récolte l'argent.",
      "V. La Coding Style : \nParfois il est bon de savoir suivre les règles.",
      "VI. Les Amoureux : \nLa raison de vivre des membres du FC Chasseur.",
      "VII. La Voiture : \nVos mains sont sur le volant, personne ne peux vous arrêter. Vous maîtrisez votre vie d'une main de maître.",
      "VIII. La Force : \nCe n'est pas seulement soulever des haltères, c'est aussi l'énergie qui nous animes tous et finir top 1 sur WarZone.",
      "IX. Le No-Life : \nAprès avoir passé plusieurs jours enfermé sans lumière dans votre chambre, vous avez enfin pu maîtriser ce nouveau framework JS qui sera obsolète dans 1 an.",
      "X. La Moulinette : \nDans la vie il y a des hauts et des bas et cela ne dépend pas toujours de vous. La moulinette est capricieuse mais la chance vous sourit aujourd'hui.",
      "XI. La Justice : \nVous récoltez les fruits de vos action.",
      "XII. Le Délégué : \nUn sacrifice indispensable.",
      "XIII. La Mort : \nVous n'avez malheureusement pas pu réussir vos rattrapages. Vous pourrez toujours commencer une nouvelle école d'ingénieur.",
      "XIV. La Pause : \nElle s'impose.",
      "XV. L'Investisseur Malhonnête : \nIl avait promis de tripler votre capital. Il a tout perdu sur la block-chain en achetant des NFTs Belle Delphine.",
      "XVI. La Tour de Canettes : \nLa vanité de ces constructions humaines qui sont toutes destinées à une destruction certaine.",
      "XVII. L'Étoile : \nVous rend invincible pendant 10 secondes.",
      "XVIII. Mode Sombre : \nSymbolise la lune et la tranquillité de la nuit. C'est le meilleur ami des nuits blanches passées à coder.",
      "XIX. Mode Clair : \nSymbolise le soleil et sa capacité à brûler la rétine. Représente aussi l'ambition et la réussite.",
      "XX. Le Bulletin : \nL'heure du jugement est arrivé, il est temps de lancer un regard objectif sur votre parcours et sur la méchanceté du prof d'ALGA.",
      "XXI. L'Apéro : \nVous avez accompli de grandes choses et une journée de travail se termine comme il se doit.",
    ];
    await interaction.deferReply();
    await sleep(2000);
    await interaction.editReply({
      content:
        "**" +
        options.getString("question") +
        "**\n\n" +
        randomString[Math.floor(Math.random() * randomString.length)],
    });
  },
};
