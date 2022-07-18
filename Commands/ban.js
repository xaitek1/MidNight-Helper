const { MessageEmbed } = require('discord.js')
const punishmentSchema = require('../Models/punishment-schema');
const archiveSchema = require('../Models/archive-schema')

//ROLES
let FOUNDER = '984505316630732911'
let CEO = '993535251445973012'
let CO_FOUNDER = '984505316630732913'
let DEVELOPER = '984505316630732915'
let MANAGER = '984505316630732914'
let MODERATOR = '984505316630732918'
let HELPER = '984505316630732919'
let STAFF = '984505316668493876'
let fullAccess = '988913956406063114'

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
                const banRole = '995768278238634045';
                let memberTarget = message.guild.members.cache.get(user.id);
                if (memberTarget.roles.cache.has(STAFF) || memberTarget.roles.cache.has(fullAccess)){
                    return message.reply('**NU INCERCA SA-TI BANEZI COLEGII BRO**');
                }
                const result = await punishmentSchema.findOne({
                    userID: user.id,
                    type: 'ban',
                })
                if (result){
                    return message.channel.send(`<@${user.id}> is already banned.`)
                }
                var reason = args.slice(1).join(' ');
                await memberTarget.roles.remove(memberTarget.roles.cache);
                if (!reason)
                {
                    reason = 'No reason provided'
                    message.channel.send(`<@${memberTarget.user.id}> has been banned.`);
                }
                else
                {
                    message.channel.send(`<@${memberTarget.user.id}> has been banned for ${reason}.`);
                }
                await memberTarget.roles.add(banRole);
                
                //SANCTIUNI
                let schema = await punishmentSchema.create({
                    userID: user.id,
                    staffID: message.author.id,
                    reason: reason,
                    type: 'ban',
                })
                schema.save();

                //ARHIVA
                let arhiva = await archiveSchema.create({
                    userID: user.id,
                    staffID: message.author.id,
                    reason: reason,
                    type: 'ban',
                })
                arhiva.save();

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
        message.reply("Missing permission: **BAN MEMBERS**")
        .then(message => {
            setTimeout(() => message.delete(), 5000);
        })
    }
}