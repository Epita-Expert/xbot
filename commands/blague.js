module.exports.blague = {
    isGlobal: false,
    data: {
        "name": "blague",
        "description": "Raconte les meilleures blagues sur le thème de l'informatique",
        "options": []
    },
    callback: ({ channel, options }) => {
        randomString = [
            "Pourquoi les Geek sont-ils fiers ?\nParce qu'ils ont une Gigabyte.",
            "Deux geeks discutent :\n-De quelle couleur sont tes yeux ?\n-#1292f4 et toi ? :)",
            "Que dit une mère à son fils geek quand le diner est servi ?\nAlt Tab !!!",
            "T'as pris quoi comme résolution pour cette nouvelle année ?\n2160p.",
            "Où partent les geeks en vacances ?\nAu C shell.",
            "est L'ordre pour critique UDP. faire bonne blague une",
            "Deux paquets UDP discutent :\n-Ah bon ?\n-Il paraît que je peux arriver avant toi",
            "Je te raconterai cette blague TCP jusqu'à ce que tu la captes.\nJe te raconterai cette blague TCP jusqu'à ce que tu la captes.\nJe te raconterai cette blague TCP jusqu'à ce que tu la captes.\nJe te raconterai cette blague TCP jusqu'à ce que tu la captes.\nJe te raconterai cette blague TCP jusqu'à ce que tu la captes.\nJe te raconterai cette blague TCP jusqu'à ce que tu la captes.\nJe te raconterai cette blague TCP jusqu'à ce que tu la captes.",
            "Refusée au bar, la requête SQL veut aller en boîte et le videur lui dit : « Non, dehors ! C'est select ici. »",
            "Désolé, les blagues IPv4 sont épuisées.",
            "Je voulais te raconter une blague sur les erreurs 404, mais je ne la retrouve plus.",
            "Un jour une femme a dit à son mari : « Va au supermarché acheter une bouteille de lait. Et tant que t'y es, prends des oeufs. ».\nIl n'est jamais revenu.",
            "Comment appelle-t-on celui qui répare les tablettes Microsoft ?\nUn technicien de surface.",
            "Si Microsoft inventait un truc qui ne plante pas, ce serait un clou.",
            "Vous ne pouvez pas comprendre la récursivité sans avoir d’abord compris la récursivité.",
            "Les développeurs ne se battent pas, ils C#."
        ]
        return randomString[Math.floor(Math.random() * randomString.length)]
    }
}