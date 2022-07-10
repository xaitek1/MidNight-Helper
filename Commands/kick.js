const { MessageEmbed } = require('discord.js');

//ROLES
let FOUNDER = '984505316630732911'
let CEO = '993535251445973012'
let CO_FOUNDER = '984505316630732913'
let DEVELOPER = '984505316630732915'
let MANAGER = '984505316630732914'
let MODERATOR = '984505316630732918'
let HELPER = '984505316630732919'

module.exports = {
    name: 'kick',
    description: 'kicks someone off the server',
    async execute(message, args, client){
        if (message.member.roles.cache.has(FOUNDER) || message.member.roles.cache.has(CEO) || message.member.roles.cache.has(CO_FOUNDER) || message.member.roles.cache.has(DEVELOPER) || message.member.roles.cache.has(MANAGER) || message.member.roles.cache.has(MODERATOR)){
            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            const kickedMember = message.mentions.users.first(); //FOLOSIT DOAR LA NICKNAME
            if (!user){
                return message.channel.send('Can\'t find that member')
            }
            let memberTarget = message.guild.members.cache.get(user.id);
            let kickedRole = '995762751593009322'
            var reason = args.slice(2).join(' ')
            if (!reason){
                reason = 'No reason provided'
            }
            if (!message.member.permissions.has('KICK_MEMBER')) {
                return message.channel.send('You don\'t have permission to kick members')
            }
            
                message.channel.send(`<@${user.user.id}> was kicked by <@${message.author.id}>`)
                memberTarget.roles.remove(memberTarget.roles.cache);
                await memberTarget.roles.add(kickedRole)
                //#SANCTIUNI
                const mesaj = new MessageEmbed()
                    .setTitle('KICK')
                    .setColor('RED')
                    .setFooter(`${process.env.VERSION} • ${new Date(message.createdTimestamp).toLocaleDateString()}`)
                    .addField(
                        'ID',
                        `${memberTarget.id}`,
                        true
                    )
                    .addField(
                        'Nickname',
                        memberTarget.nickname || kickedMember.tag.substring(0, kickedMember.tag.length - 5),
                        true
                    )
                    .addField(
                        'Mention',
                        `<@${memberTarget.id}>`,
                        true
                    )
                    .addField(
                        'Kicked by',
                        `<@${message.author.id}>`,
                        true
                    )
                    .addField(
                        'Nickname',
                        message.author.nickname || message.author.tag.substring(0, message.author.tag.length - 5),
                        true
                    )
                    .addField(
                        'Reason',
                        `${reason}`,
                        true
                    )
                    let channel = '995766750266278019'
                    client.channels.cache.get(channel).send({ embeds: [mesaj] });
                    return;
        }
        message.channel.send('Nu ai permisiune!');
    }
}