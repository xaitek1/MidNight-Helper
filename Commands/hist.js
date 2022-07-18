const { MessageEmbed } = require('discord.js')
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
    name: 'hist',
    description: 'shows the hist of a user',
    async execute (message, args) {
        if (message.member.roles.cache.has(FOUNDER) || message.member.roles.cache.has(CEO) || message.member.roles.cache.has(CO_FOUNDER) || message.member.roles.cache.has(DEVELOPER) || message.member.roles.cache.has(MANAGER) || message.member.roles.cache.has(MODERATOR) || message.member.roles.cache.has(HELPER) || message.member.roles.cache.has(STAFF) || message.member.roles.cache.has(fullAccess))
        {
            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]); //FOLOSIT DOAR LA MEMBERTARGET
            if (user)
            {
                const results = await archiveSchema.find({
                    userID: user.id,
                })
                if (results.length === 0) {
                    let mesaj = new MessageEmbed()
                    .setColor('RED')
                    .addField(
                        'HISTORY',
                        'clean',
                    )
                    return message.channel.send({ embeds: [mesaj] });
                }
                let reply = ''
                for (const result of results) {
                    reply += `[+] **${result.type.toUpperCase()}** at ${new Date(result.createdAt).toLocaleDateString()} by <@${result.staffID}> for \`${result.reason}\`\n\n`
                }
                let mesaj = new MessageEmbed()
                .setColor('RED')
                .setFooter(`${process.env.VERSION} • ${new Date(message.createdTimestamp).toLocaleDateString()}`)
                .addField(
                    'HISTORY',
                    `${reply}`,
                )
                message.channel.send({ embeds: [mesaj] });
            }
            return;
        }
        message.reply("Missing permission: **HIST**")
        .then(message => {
            setTimeout(() => message.delete(), 5000);
        })
    }
}
