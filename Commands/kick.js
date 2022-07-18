const { MessageEmbed } = require('discord.js');
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
            if (memberTarget.roles.cache.has(STAFF) || memberTarget.roles.cache.has(fullAccess)){
                return message.reply('**NU INCERCA SA-TI DAI KICK LA COLEGI BRO**');
            }
            const result = await punishmentSchema.findOne({
                userID: user.id,
                type: 'kick',
            })
            if (result){
                return message.channel.send(`<@${user.id}> is already kicked.`)
            }
            const kickedRole = '995762751593009322'
            var reason = args.slice(1).join(' ')
            if (!reason){
                reason = 'No reason provided'
            }
            message.channel.send(`<@${user.user.id}> was kicked by <@${message.author.id}>`)
            await memberTarget.roles.remove(memberTarget.roles.cache);
            await memberTarget.roles.add(kickedRole)
            memberTarget.roles.add(kickedRole);
            
            //SANCTIUNI
            let schema = await punishmentSchema.create({
                userID: user.id,
                staffID: message.author.id,
                reason: reason,
                type: 'kick',
            })
            schema.save();

            //ARHIVA
            let arhiva = await archiveSchema.create({
                userID: user.id,
                staffID: message.author.id,
                reason: reason,
                type: 'kick',
            })
            arhiva.save();

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
        message.reply("Missing permission: **KICK MEMBERS**")
        .then(message => {
            setTimeout(() => message.delete(), 5000);
        })
    }
}