module.exports.ping = {
    isGlobal: false,
    data: {
        "name": "ping",
        "description": "Ping le meilleur des bots du serveur !",
        "options": []
    },
    callback: ({ channel, options }) => {
        randomString = [
            'Attention ! Ce bot est développé par un Expert, ne faîtes pas ça chez vous.',
            'J\'suis là...',
            'C\'est à moi que tu parles ?',
            'ALLO ?',
            'Toujours vivant, toujours debout !',
            'Pong',
            'Tu vas la fermer ta gue*le ?',
            'QUOI ENCORE ???!!!',
            'Oui ?',
            'On m\'appelle ?',
            'Je suis en ligne, pas sûr que ce soit encore le cas ' + (process.env.YBOT_ID ? 'de <@' + process.env.YBOT_ID + '>' : 'des autres bots') + '...'
        ]
        return randomString[Math.floor(Math.random() * randomString.length)]
    }
}