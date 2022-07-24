const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js')
const { connection } = require('mongoose')

module.exports = {
    name: 'status',
    description: 'displays status of the bot',
    async execute(client, interaction){
        const ping = (interaction.createdTimestamp - Date.now()) * (-1)
        const mesaj = new MessageEmbed()
        .setColor('RED')
        .setDescription(`**CLIENT**: \`🟢 ONLINE\`\n**PING**: \`${ping}\`\n**UPTIME**: <t:${Math.floor(parseInt(client.readyAt / 1000))}:R>\n\n**DATABASE**: \`${switchTo(connection.readyState)}\``)
        interaction.followUp({ embeds: [mesaj] })
    }
}

function switchTo(val) {
    var status = ' '
    switch (val) {
        case 0:
            status = '🔴 DISCONNECTED'
            break;
        case 1:
            status = '🟢 CONNECTED'
            break;
        case 2:
            status = '🟠 CONNECTING'
            break;
    }
    return status
}