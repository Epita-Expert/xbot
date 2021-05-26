const pipotron  = require('pipotron')

module.exports.pipo = {
    isGlobal: false,
    data: {
        "name": "pipo",
        "description": "Pipote une phrase corporate pour vos meilleurs calls",
        "options": []
    },
    callback: ({ channel, options }) => {
        return pipotron()
    }
}