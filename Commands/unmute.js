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
    name: 'unmute',
    description: 'unmutes a member',
    async execute(message, args, client){
        if (message.member.roles.cache.has(FOUNDER) || message.member.roles.cache.has(CEO) || message.member.roles.cache.has(CO_FOUNDER) || message.member.roles.cache.has(DEVELOPER) || message.member.roles.cache.has(MANAGER) || message.member.roles.cache.has(MODERATOR) || message.member.roles.cache.has(HELPER)){
            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]); //FOLOSIT DOAR LA MEMBERTARGET
            const mutedMember = message.mentions.users.first(); //FOLOSIT DOAR LA NICKNAME
            if (user)
            {
                let muteRole = '984869290194903060';
                let memberTarget = message.guild.members.cache.get(user.id);
                var reason = args.slice(1).join(' ');
                memberTarget.roles.remove(muteRole);
                message.channel.send(`<@${memberTarget.user.id}> has been unmuted`);
                if (!reason)
                {
                    reason = 'No reason provided'
                }
                //#SANCTIUNI
                const mesaj = new MessageEmbed()
                    .setTitle('UNMUTE')
                    .setColor('GREEN')
                    .setFooter(`${process.env.VERSION} • ${new Date(message.createdTimestamp).toLocaleDateString()}`)
                    .addField(
                        'ID',
                        `${memberTarget.id}`,
                        true
                    )
                    .addField(
                        'Nickname',
                        memberTarget.nickname || mutedMember.tag.substring(0, mutedMember.tag.length - 5),
                        true
                    )
                    .addField(
                        'Mention',
                        `<@${memberTarget.id}>`,
                        true
                    )
                    .addField(
                        'Unmuted by',
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
            else
            {
                message.channel.send('Can\'t find that member');
            }
            return;
        }
        message.channel.send('Nu ai permisiune!');
    }
}