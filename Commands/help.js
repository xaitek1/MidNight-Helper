const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'displays help about the commands of the bot',
    execute(client, interaction){
        var mesaj = new MessageEmbed()
        .setColor('BLURPLE')
        .setTitle('ℹ️ HELP')
        .addField(
            'HELP',
            'Displays this message'
        )
        .addField(
            'STATUS',
            'Displays bot statistics'
        )
        .addField(
            'TAG',
            'Shows the tags of this server'
        )
        .addField(
            'PURGE',
            `Purge messages (optional: from a user)\nUsage:\n\`purge 10\` deletes the last 10 messages\n\`purge 10 @Lancer\` deletes the last 10 messages sent by Lancer`
        )
        .addField(
            'KICK',
            `Example: \`kick @Lancer noob\``
        )
        .addField(
            'MUTE | BAN',
            `Temporarily mutes a member\nUsage: \`mute @Lancer 10m reason\`\n\nTemporarily bans a member\nUsage: \`ban @Lancer reason\``
        )
        .addField(
            'UNMUTE | UNBAN',
            `Unmutes a member\nUsage: \`unmute @Lancer reason\`\n\nUnbans a member\nUsage: \`unban @Lancer reason\``
        )
        .addField(
            'USER-INFO',
            `Displays information about a specific user\nUsage:\`user-info @Lancer\` OR \`user-info\` (for your own info)`
        )
        .addField(
            'SERVER-INFO',
            `Displays information about the server`
        )
        .addField(
            'TICKET-UNBAN',
            `Generates new unban ticket`
        )
        .addField(
            'VERIFY-KICK',
            `Generates a new verify kick message`
        )
        .setFooter(`${process.env.VERSION} • ${new Date(interaction.createdTimestamp).toLocaleDateString()} • © Sergetec`)
        interaction.followUp({ embeds: [mesaj] });
    }
};