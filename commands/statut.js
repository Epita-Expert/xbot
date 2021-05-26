module.exports.statut = {
    isGlobal: false,
    data: {
        "name": "statut",
        "description": "Change le statut du bot (Administrateurs de xBot uniquement)",
        "default_permission": false,
        "options": [
            {
                "name": "message",
                "description": "Le message de statut",
                "type": 3,
                "required": true
            }
        ]
    },
    permissions:  [
        {
            "id": process.env.SUPERADMIN_ID,
            "type": 2,
            "permission": true
        }
    ],
    callback: ({ channel, options }) => {
        /*client.user.setPresence({ activity: { name: 'with discord.js' }, status: 'idle' })
            .then(console.log)
            .catch(console.error)*/
        return 'statut changé'
    }
}