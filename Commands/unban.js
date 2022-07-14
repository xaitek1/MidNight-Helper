const { MessageEmbed } = require('discord.js');
const punishmentSchema = require('../Models/punishment-schema');

//ROLES
let FOUNDER = '984505316630732911'
let CEO = '993535251445973012'
let CO_FOUNDER = '984505316630732913'
let DEVELOPER = '984505316630732915'
let MANAGER = '984505316630732914'
let MODERATOR = '984505316630732918'
let HELPER = '984505316630732919'

module.exports = {
    name: 'unban',
    description: 'unbans a member',
    async execute(message, args, client){
        if (message.member.roles.cache.has(FOUNDER) || message.member.roles.cache.has(CEO) || message.member.roles.cache.has(CO_FOUNDER) || message.member.roles.cache.has(DEVELOPER) || message.member.roles.cache.has(MANAGER)){
            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]); //FOLOSIT DOAR LA MEMBERTARGET
            const bannedMember = message.mentions.users.first(); //FOLOSIT DOAR LA NICKNAME
            if (user)
            {
                let banRole = '995768278238634045';
                let memberTarget = message.guild.members.cache.get(user.id);
                let mainRole = '984505316731420821';
                var reason = args.slice(1).join(' ');
                await memberTarget.roles.add(mainRole);
                await memberTarget.roles.remove(banRole);
                message.channel.send(`<@${memberTarget.user.id}> has been unbanned.`);
                if (!reason)
                {
                    reason = 'No reason provided'
                }

                //DELETING FROM DATABASE
                const query = {
                    userID: memberTarget.user.id,
                }
                const results = await punishmentSchema.find(query)
                for (const result of results){
                    const { type } = result
                    if (type === 'ban'){
                        await punishmentSchema.deleteMany(query)
                    }
                }

                //#SANCTIUNI
                const mesaj = new MessageEmbed()
                    .setTitle('UNBAN')
                    .setColor('GREEN')
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
                        'Unbanned by',
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
        message.reply("Missing permission: **UNBAN MEMBERS**")
        .then(message => {
            setTimeout(() => message.delete(), 5000);
        })
    }
};