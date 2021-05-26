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
    callback: ({ channel, options, user, client }) => {
        setTimeout(() => {
            let targetChan = options.salon ? channel.guild.channels.cache.get(options.salon) : channel
            console.log(user.username + " (id:" + user.id + ") used the bot to say '" + options.message + "'")
            channel.messages.fetch({ limit: 10 }).then(messages => {
                let lastMessage = messages.filter(msg => (msg.author.id === client.user.id && msg.content == 'Suppression en cours...')).first()

                if (lastMessage) {
                    lastMessage.delete().then(() => {
                        targetChan.send(options.message)
                    })
                }
            })
        }, 75)
        return 'Suppression en cours...'
    }
}