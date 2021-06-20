const Minesweeper = require('discord.js-minesweeper')

module.exports.demineur = {
    isGlobal: false,
    data: {
        "name": "demineur",
        "description": "Joue au Démineur",
        "options": [
            {
                "name": "difficulte",
                "description": "Difficulté du jeu",
                "type": 3,
                "required": true,
                "choices": [
                    {
                        "name": "Débutant",
                        "value": "debutant"
                    },
                    {
                        "name": "Intermédiaire",
                        "value": "intermediaire"
                    },
                    {
                        "name": "Expert",
                        "value": "expert"
                    },
                    {
                        "name": "OMG WTF",
                        "value": "omg"
                    }
                ]
            }
        ]
    },
    callback: async ({ channel, options, user, subcommands, client }) => {
        const level = options.difficulte
        let rows = 9
        let columns = 9
        let mines = 10
        let diff = ''
        if (level === "debutant") {
            diff = 'Débutant'
        } else if (level === "intermediaire") {
            diff = 'Intermédiaire'
            let alea = Math.floor(Math.random() * 2)
            mines = 40
            rows = alea ? 15 : 16
            columns = alea ? 13 : 16
        } else if (level === "expert") {
            diff = 'Expert'
            mines = 99
            rows = 30
            columns = 16
        } else if (level === "omg") {
            diff = 'OMG WTF'
            mines = 200
            rows = 30
            columns = 24
        }
        const minesweeper = new Minesweeper({ rows, columns, mines })
        let matrix = minesweeper.start()
        if (matrix) {
            matrix = matrix.replace(/\|\| /g, '||')
            matrix = matrix.replace(/ \|\|/g, '||')
            matrix = matrix.replace(/\|\|\|\|/g, '|| ||')
            if (matrix.length > 2000) {
                let chunk = matrix.split("\n")
                chunk.forEach((elt)=>{
                    channel.send(elt+"\n")
                })
            }
            setTimeout(()=>{
                channel.send(matrix)
            }, 75)
        }

        return matrix ? ':boom: **DÉMINEUR** - *Difficulté : '+diff+' ('+rows+'x'+columns+' - '+mines+' mines)*' : ':warning: Une erreur est survenue...'
    }
}