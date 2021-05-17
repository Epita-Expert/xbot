module.exports = {
    slash: true,
    testOnly: true,
    description: 'Vérifie si le bot est encore en vie',
    callback: () => {
        randomString = ['Attention ! Ce bot est développé par un Expert, ne faîtes pas ça chez vous.', 'J\'suis là...', 'C\'est à moi que tu parles ?', 'ALLO ?', 'Toujours vivant, toujours debout !', 'Pong','Tu vas la fermer ta gue*le ?', 'QUOI ENCORE ???!!!', 'Oui ?', 'On m\'appelle ?']
        return randomString[Math.floor(Math.random() * randomString.length)]
    },
}
