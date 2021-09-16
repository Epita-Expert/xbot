module.exports = {
    isGlobal: false,
    guilds: ["761233808645029888","760082078406148136"],
    data: {
        "name": "liens",
        "description": "Affiche des liens utiles de l'EPITA",
        "options": []
    },
    execute: async ({interaction}) => {
        await interaction.reply({
            "content": null,
            "embeds": [
                {
                    "title": "Liens utiles EPITA  🔗",
                    "description": "N.B. Sélection non-exhaustive, le site epita.it et la page d'accueil du CRI sont des bons compléments à cette liste.",
                    "color": 7182803,
                    "fields": [
                        {
                            "name": "EPITA.it",
                            "value": "Portail vers les services et les projets liés à l'EPITA.\nhttps://epita.it/"
                        },
                        {
                            "name": "Moodle CRI",
                            "value": "Plateforme de cours en ligne Moodle.\nhttps://moodle.cri.epita.fr/"
                        },
                        {
                            "name": "Pegasus",
                            "value": "Pour consulter les relevés de notes et les bulletins.\nhttps://inge-etud.epita.net/pegasus/index.php#"
                        },
                        {
                            "name": "Zeus (3ie)",
                            "value": "Plateforme d'emploi du temps.\nhttps://zeus.ionis-it.com/home"
                        },
                        {
                            "name": "Epimap",
                            "value": "Plan des bâtiments/salles de l'EPITA.\nhttps://map.epita.eu/"
                        }
                    ]
                },
                {
                    "title": "Discord officiels EPITA  💬",
                    "description": "Les serveurs officiel EPITA de promotions sont gérés indirectement par l'école. Ils sont surtout orientés vers les formations en initial, aussi en plus des étudiants vous trouverez également ACU/YAKA, profs et membres de l'administration au sein de ces serveurs.",
                    "color": 7182803,
                    "fields": [
                        {
                            "name": "Discord EPITA 2023",
                            "value": "Serveur officiel EPITA promo. 2023 (surtout orienté formation initiale)\nhttps://epita.cf/2023"
                        },
                        {
                            "name": "Discord EPITA 2024",
                            "value": "Serveur officiel EPITA promo. 2024 (idem)\nhttps://epita.cf/2024"
                        },
                        {
                            "name": "Discord EPITA 2025",
                            "value": "Serveur officiel EPITA promo. 2025 (idem)\nhttps://epita.cf/2025"
                        }
                    ]
                }
            ]
        })
    }
}