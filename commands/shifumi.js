module.exports.shifumi = {
    isGlobal: false,
    data: {
        "name": "shifumi",
        "description": "Joue au Pierre-Feuille-Ciseaux avec le bot",
        "options": [
            {
                "name": "signe",
                "description": "Signe Shifumi",
                "type": 3,
                "required": true,
                "choices": [
                    {
                        "name": "👊 Pierre",
                        "value": "pierre"
                    },
                    {
                        "name": "✋ Feuille",
                        "value": "feuille"
                    },
                    {
                        "name": "✌️ Ciseaux",
                        "value": "ciseaux"
                    }
                ]
            }
        ]
    },
    callback: ({ channel, options, user }) => {
        const signs = {
            pierre: {
                beat: 'ciseaux',
                icon: '👊'
            },
            feuille: {
                beat: 'pierre',
                icon: '✋'
            },
            ciseaux: {
                beat: 'feuille',
                icon: '✌'
            }
        }
        const userSign = options.signe
        const signsList = Object.keys(signs)
        const botSign = signsList[Math.floor(Math.random() * signsList.length)]
        let sentence = ''
        if (botSign === userSign) {
            sentence = '**On dirait bien une égalité.**'
        } else if (signs[botSign].beat === userSign) {
            sentence = '**J\'ai gagné !**'
        } else {
            sentence = '**Tu as gagné, bien joué...**'
        }
        return signs[userSign].icon + " vs " + signs[botSign].icon + "\n" + sentence
    }
}