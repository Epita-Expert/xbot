module.exports = {
    isGlobal: false,
    data: {
        "name": "aleatoire",
        "description": "Affiche un nombre aléatoire entre 0 et 1 (par défaut)",
        "options": [
            {
                "name": "min",
                "description": "(Optionnel) Borne minimum - par défaut 0",
                "type": 'INTEGER',
                "required": false
            },
            {
                "name": "max",
                "description": "(Optionnel) Borne maximum - par défaut 1",
                "type": 'INTEGER',
                "required": false
            }
        ]
    },
    execute: async ({ options, interaction }) => {
        const min = options.getInteger('min') || 0
        const max = options.getInteger('max') || 1
        if (max <= 0 || min >= max || min < 0){
            await interaction.reply({ content: 'Conflit dans les bornes minimum/maximum. Merci de réessayer.', ephemeral: true })
            return
        }
        await interaction.reply({ content: Math.floor(Math.random() * (max - min + 1) + min).toString() })
    }
}