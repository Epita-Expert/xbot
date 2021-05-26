module.exports.aleatoire = {
    isGlobal: false,
    data: {
        "name": "aleatoire",
        "description": "Affiche un nombre aléatoire entre 0 et 1 (par défaut)",
        "options": [
            {
                "name": "min",
                "description": "(Optionnel) Borne minimum - par défaut 0",
                "type": 4,
                "required": false
            },
            {
                "name": "max",
                "description": "(Optionnel) Borne maximum - par défaut 1",
                "type": 4,
                "required": false
            }
        ]
    },
    callback: ({ channel, options, user }) => {
        const min = options.min || 0
        const max = options.max || 1
        if (max <= 0 || min >= max || min < 0){
            return 'Conflit dans les bornes minimum/maximum. Merci de réessayer.'
        }
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}