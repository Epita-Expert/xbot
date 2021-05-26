const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

module.exports.meme = {
    isGlobal: false,
    data: {
        "name": "meme",
        "description": "Affiche un meme aléatoire issue de Reddit (possibilité de préciser le subreddit)",
        "options": [
            {
                "name": "subreddit",
                "description": "Le nom du subreddit où récupérer le meme (sans le 'r/')",
                "type": 3,
                "required": false
            }
        ]
    },
    callback: async ({ channel, options }) => {
        let subr = options.subreddit || 'memes'
        if (subr) {
            const regex = /([a-zA-Z0-9-_]*)/g
            if(!subr.match(regex)) {
                return 'Nom du subreddit invalide.'
            }
            subr = '/' + subr
        }
        const { title, url, nsfw, postLink, subreddit } = await fetch('https://meme-api.herokuapp.com/gimme' + subr).then(response => response.json())
        if (url && (nsfw === false || channel.nsfw)) {
            const embed = new MessageEmbed().setURL(postLink).setColor('#6d99d3').setImage(url).setFooter('r/' + subreddit)
            if (title)
                embed.setTitle(title)
            return embed
        } else if(url && nsfw === true){
            return "Nope, pas de ça ici... 😏"
        } else {
            return "Je n'ai trouvé aucun meme... 😔"
        }
    }
}