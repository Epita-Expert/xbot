const Interaction = {
    async reply(arg){
        return true
    },
    async fetchReply(){
        return Message
    },
    async editReply(arg){
        return true
    },
    async deferReply(arg){
        return true
    },
    async followUp(arg){
        return true
    }
}

const Message = {
    createMessageComponentCollector: () => {
        return Collector
    },
    react: (str) => {
        return true
    },
    reply: (str) => {
        return true
    }
}

const Collector = {
    on(e, fn) {
        const args = {
            customId: "pierre",
            ...Client,
            ...Interaction
        }
        fn(args)
    }
}

class Options {
    values = {}
    subcommand = ""

    constructor(values){
        this.values = values ?? {}
    }

    getString(str){
        return str in this.values ? this.values[str].toString() : ""
    }

    getInteger(str){
        return str in this.values ? this.values[str] : ""
    }

    getChannel(str){
        return str in this.values ? this.values[str] : ""
    }

    getSubcommand(){
        return this.subcommand
    }

    setSubcommand(cmd){
        this.subcommand = cmd
    }
}

class User {
    id = "123456789"
    username = "toto"

    constructor(id) {
        if (id) {
            this.id = id
        }
    }

    setActivity() {

    }
}

const Channel = {
    guild: {
        members: {
            cache: {
                get:()=>{
                    return new User
                }
            }
        },
        channels: {
            cache: {
                find:(arg) => {
                    arg([])
                    return Channel
                }
            }
        }
    },
    messages: {
        fetch: (id) => {
            return new Promise((resolve, reject) => {resolve(Message)})
        }
    },
    send: (msg) => {
        return true
    }
}

const Client = {
    user: new User()
}

module.exports.client = Client;
module.exports.channel = Channel;
module.exports.user = User;
module.exports.options = Options;
module.exports.interaction = Interaction;
