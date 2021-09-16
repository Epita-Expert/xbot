const { MessageEmbed } = require('discord.js')

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max) + 1
}

module.exports = {
    isGlobal: false,
    data: {
        "name": "Karma",
        "type": "USER",
    },
    execute: async ({ options, interaction, channel }) => {
        const embed = new MessageEmbed()
            .setAuthor('bonaventure ‍✨')
            .setDescription('Voilà le karma de <@'+interaction.targetId+'> !')
            .setColor('#6d99d3')
            .addField('Sexo: ', ':star:'.repeat(getRandomInt(4)), true)
            .addField('Taf: ', ':star:'.repeat(getRandomInt(4)), true)
            .addField('Gentar: ', ':star:'.repeat(getRandomInt(4)), true)
            .addField('Mifa: ', ':star:'.repeat(getRandomInt(4)), true)
            .addField('Sante: ', ':star:'.repeat(getRandomInt(4)), true)
        await interaction.reply({ embeds: [embed] })
    }
}