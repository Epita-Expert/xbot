module.exports.dit = {
    isGlobal: false,
    data: {
        "name": "dit",
        "description": "Fait parler le bot à ta place dans ce salon ou ailleurs",
        "options": [
            {
                "name": "message",
                "description": "Le message que le bot enverra anonymement à ta place",
                "type": 3,
                "required": true
            },
            {
                "name": "salon",
                "description": "(Optionnel) Choisis un salon où envoyer ton message, par défaut dans le salon actuel",
                "type": 7,
                "required": false
            }
        ]
    },
    callback: ({ channel, options }) => {
        setTimeout(() => {
            let targetChan = options.salon ? channel.guild.channels.cache.get(options.salon) : channel
            channel.messages.fetch({ limit: 1 }).then(messages => {
                let lastMessage = messages.first()
                if (lastMessage.author.bot) {
                    lastMessage.delete().then(() => {
                        targetChan.send(options.message)
                    })
                }
            })
        }, 100)
        return '*Envoi du message :* ' + options.message || 'Oups, ça a mal tourné...'
    }
}