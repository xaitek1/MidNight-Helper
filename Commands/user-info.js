const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'user-info',
    description: 'displays user info',
    async execute(message) {
        const {guild} = message
        const user = message.mentions.users.first() || message.author
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
        .setFooter(`${process.env.VERSION} • ${new Date(message.createdTimestamp).toLocaleDateString()}`)
        message.channel.send({embeds: [mesaj]});
    }
}