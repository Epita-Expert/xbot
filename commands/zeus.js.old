const moment = require('moment')
const fs = require("fs")
const getRanHex = size => {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    for (let n = 0; n < size; n++) {
        result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join('');
}

module.exports = {
    isGlobal: false,
    guilds: ["761233808645029888","760082078406148136"],
    data: {
        "name": "zeus",
        "description": "[DEPRECATED SOON] - Affiche l'agenda des cours de l'EPITA",
        "options": [
            {
                "name": "format",
                "description": "Le format du calendrier à afficher : Jour, Semaine ou Mois (par défaut \"Semaine\")",
                "type": 'STRING',
                "required": false,
                "choices": [
                    {
                        "name": "Jour",
                        "value": "day"
                    },
                    {
                        "name": "Semaine",
                        "value": "week"
                    },
                    {
                        "name": "Mois",
                        "value": "month"
                    }
                    ]
            },
            {
                "name": "date_de_debut",
                "description": "La date de début de l'affichage au format JJ/MM/AAAA (par défaut la date du jour)",
                "type": 'STRING',
                "required": false
            },
            {
                "name": "groupe",
                "description": "Le nom du groupe à afficher, issue du groupe parent \"EPITAPPRENTISSAGE\" (par défaut \"APPING_X 2\")",
                "type": 'STRING',
                "required": false,
                "choices": [
                    {
                        "name": "APPING_I 1A",
                        "value": "APPING_I 1A"
                    },
                    {
                        "name": "APPING_I 1B",
                        "value": "APPING_I 1B"
                    },
                    {
                        "name": "APPING_X 1",
                        "value": "APPING_X 1"
                    },
                    {
                        "name": "APPING_I 2A",
                        "value": "APPING_I 2A"
                    },
                    {
                        "name": "APPING_I 2B",
                        "value": "APPING_I 2B"
                    },
                    {
                        "name": "APPING_X 2",
                        "value": "APPING_X 2"
                    },
                    {
                        "name": "APPING_I 3A",
                        "value": "APPING_I 3A"
                    },
                    {
                        "name": "APPING_I 3B",
                        "value": "APPING_I 3B"
                    },
                    {
                        "name": "APPING_X 3",
                        "value": "APPING_X 3"
                    }
                ]
            }
        ]
    },
    execute: async ({interaction, options}) => {
        moment.locale("fr")
        await interaction.deferReply();
        const format = options.getString('format') || 'week'
        const date_de_debut = options.getString('date_de_debut') || moment().format('L')
        if (/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/g.test(date_de_debut) === false) {
            await interaction.editReply({ content: "**ERREUR** : La date doit être au format JJ/MM/AAAA." })
            return
        }
        const date_reversed = date_de_debut.split('/').reverse().join('-')
        const groupes = {
            "APPING_I 1A": 246,
            "APPING_I 1B": 247,
            "APPING_X 1": 248,
            "APPING_I 2A": 250,
            "APPING_I 2B": 251,
            "APPING_X 2": 252,
            "APPING_I 3A": 254,
            "APPING_I 3B": 255,
            "APPING_X 3": 256
        }
        const groupe_nom = options.getString('groupe') || "APPING_X 2"
        const groupe = (groupe_nom && groupe_nom in groupes) ? groupes[groupe_nom] : 252
        let filename = ''
        do {
            filename = getRanHex(6)
        } while (fs.existsSync("/home/centos/public_html/moreaux.dev/html/zeus/"+filename+".png"))

        const captureWebsite = await import('capture-website').then(e => {return e.default})
        await captureWebsite.file('https://zeus.infinity.study/groups/'+groupe+'#date='+date_reversed+',mode='+format, "/home/centos/public_html/moreaux.dev/html/zeus/"+filename+".png", {
            hideElements: [
                '.dhx_cal_navline'
            ],
            element: "#scheduler_here",
            width: 1640,
            height: 920,
            inset: {
                top: 80,
                right: format === "week" ? 375 : 0,
                bottom: format !== "month" ? 170 : 0
            },
            scrollToElement: format !== "month" ? '.dhx_scale_hour[aria-label="07:00"]' : null,
            overwrite: true
        })
        let niceDate = ''
        if (format === "day") {
            niceDate = "Journée du " + date_de_debut
        } else if (format === "week") {
            niceDate = "Semaine du " + moment(date_reversed).startOf('week').format("LL") + " (" + moment(date_reversed).format("W") + ")"
        } else if (format === "month") {
            niceDate = "Mois de " + moment(date_reversed).startOf('month').format("MMMM YYYY")
        }
        await interaction.editReply({
            "content": null,
            "embeds": [
                {
                    "title": ":calendar_spiral: **Emploi du temps ZEUS**",
                    "description": groupe_nom + " - " + niceDate,
                    "color": 7182803,
                    "footer": {
                        "text": "📷 Clique sur l'image pour l'agrandir. Données récoltées le "+moment().format('L')+" à "+moment().format('LT')+". Celles-ci sont susceptibles d'être modifiées."
                    },
                    "image": {
                        "url": "https://thomas.moreaux.dev/zeus/"+filename+".png"
                    }
                }
            ]
        })
    }
}