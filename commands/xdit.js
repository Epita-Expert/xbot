module.exports = {
    slash: true,
    testOnly: true,
    description: 'Fait parler le bot à ta place',
    expectedArgs: '<message>',
    minArgs: 1,
    maxArgs: 1,
    callback: ({ message, channel, args }) => {
        setTimeout(() => {
            channel.messages.fetch({ limit: 1 }).then(messages => {
                let lastMessage = messages.first()
                if (lastMessage.author.bot)
                    lastMessage.delete()
            }).catch(console.error)
            channel.send(args[0])
        }, 100)
	    return args[0] || 'Erreur'
    },
}
