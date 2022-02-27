const mongoose = require('mongoose')

mongoose.connect('mongodb://'+process.env.DB_USER+':'+process.env.DB_PWD+'@'+process.env.DB_URL+':18888/xbot?authSource=admin', {useNewUrlParser: true, useUnifiedTopology: true})
db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log("MongoDB successfully connected") )

const reqString = {
    type: String,
    required: true
}

const agendaSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    msgId: reqString,
    channelId: reqString,
    guildId: reqString,
    name: reqString,
    description: reqString,
    subscribers: [String],
    send: {
        type: Array,
        default: [false, false, false, false]
    }
})

const name = 'xbotAgenda'

module.exports = mongoose.model[name] || mongoose.model(name, agendaSchema, name)