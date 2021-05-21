const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/xbot', {useNewUrlParser: true, useUnifiedTopology: true})
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
    subscribers: [String],
    send: {
        type: Array,
        default: [false, false, false, false]
    }
})

const name = 'xbotAgenda'

module.exports = mongoose.model[name] || mongoose.model(name, agendaSchema, name)