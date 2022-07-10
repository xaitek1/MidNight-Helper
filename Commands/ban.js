const { MessageEmbed } = require('discord.js')


//ROLES
let FOUNDER = '984505316630732911'
let CEO = '993535251445973012'
let CO_FOUNDER = '984505316630732913'
let DEVELOPER = '984505316630732915'
let MANAGER = '984505316630732914'
let MODERATOR = '984505316630732918'
let HELPER = '984505316630732919'

module.exports = {
    name: 'ban',
    description: 'soft-bans a member',
    async execute(message, args, client){
        if (message.member.roles.cache.has(FOUNDER) || message.member.roles.cache.has(CEO) || message.member.roles.cache.has(CO_FOUNDER) || message.member.roles.cache.has(DEVELOPER) || message.member.roles.cache.has(MANAGER))
        {
            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]); //FOLOSIT DOAR LA MEMBERTARGET
            const bannedMember = message.mentions.users.first(); //FOLOSIT DOAR LA NICKNAME
            if (user)
            {
                let banRole = '995768278238634045';
                let memberTarget = message.guild.members.cache.get(user.id);
                var reason = args[1];
                memberTarget.roles.remove(memberTarget.roles.cache);
                memberTarget.roles.add(banRole);
                if (!reason)
                {
                    reason = 'No reason provided'
                    message.channel.send(`<@${memberTarget.user.id}> has been banned.`);
                }
                else
                {
                    message.channel.send(`<@${memberTarget.user.id}> has been banned for ${reason}.`);
                }

                    //#SANCTIUNI
                    const mesaj = new MessageEmbed()
                    .setTitle('BAN')
                    .setColor('RED')
                    .setFooter(`${process.env.VERSION} • ${new Date(message.createdTimestamp).toLocaleDateString()}`)
                    .addField(
                        'ID',
                        `${memberTarget.id}`,
                        true
                    )
                    .addField(
                        'Nickname',
                        memberTarget.nickname || bannedMember.tag.substring(0, bannedMember.tag.length - 5),
                        true
                    )
                    .addField(
                        'Mention',
                        `<@${memberTarget.id}>`,
                        true
                    )
                    .addField(
                        'Banned by',
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
            else{
                message.channel.send('Can\'t find that member');
            }
            return;
        }
        message.channel.send('Nu ai permisiune!');
    }
}