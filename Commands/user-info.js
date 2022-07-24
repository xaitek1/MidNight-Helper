const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'user-info',
    description: 'displays informations about a user',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to be banned',
            required: false,
        },
    ],
    async execute(client, interaction) {
        const {guild} = interaction
        const user = interaction.options.getUser('user') || interaction.user
        const member = guild.members.cache.get(user.id)

        const mesaj = new MessageEmbed()
        .setColor("RED")
        .setAuthor(user.tag, user.avatarURL({dynamic: true, size: 512}))
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .addField('ID', user.id)
        .addField('Mention', `<@${user.id}>`)
        .addField('Nickname', member.nickname || user.tag.substring(0, user.tag.length - 5))
        .addField('Roles', `${member.roles.cache.map(r => r).join(' ').replace("@everyone", " ") || "None"}`)
        .addField('Joined', new Date(member.joinedTimestamp).toLocaleDateString())
        .addField('Created', new Date(user.createdTimestamp).toLocaleDateString())
        .setFooter(`${process.env.VERSION} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
        interaction.followUp({embeds: [mesaj]});
    }
}