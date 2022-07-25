const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js')
const archiveSchema = require('../Models/archive-schema')

//ROLES
let FOUNDER = '984505316630732911'
let CEO = '993535251445973012'
let CO_FOUNDER = '984505316630732913'
let DEVELOPER = '984505316630732915'
let MANAGER = '984505316630732914'
let SUPERVIZOR = '1000368593889923082'
let ADMIN = '1000369099563614330'
let MODERATOR = '984505316630732918'
let HELPER = '984505316630732919'
let TRIAL_HELPER = '1000369518465527809'
let STAFF = '984505316668493876'
let fullAccess = '988913956406063114'

module.exports = {
    name: 'hist',
    description: 'shows the hist of a user',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to show the hist',
            required: true,
        },
    ],
    async execute (client, interaction){
        if (interaction.member.roles.cache.has(FOUNDER) || interaction.member.roles.cache.has(CEO) || interaction.member.roles.cache.has(CO_FOUNDER) || interaction.member.roles.cache.has(DEVELOPER) || interaction.member.roles.cache.has(MANAGER) || interaction.member.roles.cache.has(ADMIN) || interaction.member.roles.cache.has(MODERATOR) || interaction.member.roles.cache.has(HELPER) || interaction.member.roles.cache.has(STAFF) || interaction.member.roles.cache.has(fullAccess))
        {
            const user = interaction.options.getUser('user'); //FOLOSIT DOAR LA MEMBERTARGET
            const targetedMember = interaction.options.getUser('user'); //FOLOSIT DOAR LA NICKNAME
            let memberTarget = interaction.options.getUser('user');
            if (user)
            {
                const results = await archiveSchema.find({
                    userID: user.id,
                })
                if (results.length === 0) {
                    let mesaj = new MessageEmbed()
                    .setColor('RED')
                    .addField(
                        `HISTORY for \`${memberTarget.nickname || targetedMember.tag.substring(0, targetedMember.tag.length - 5)}\``,
                        'clean',
                    )
                    return interaction.followUp({ embeds: [mesaj] });
                }
                let reply = ''
                for (const result of results) {
                    reply += `[${result._id}] **${result.type.toUpperCase()}** at ${new Date(result.createdAt).toLocaleDateString()} by <@${result.staffID}> for \`${result.reason}\`\n\n`
                }
                let mesaj = new MessageEmbed()
                .setColor('RED')
                .setFooter(`${process.env.VERSION} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
                .addField(
                    `HISTORY for \`${memberTarget.nickname || targetedMember.tag.substring(0, targetedMember.tag.length - 5)}\``,
                    `${reply}`,
                )
                interaction.followUp({ embeds: [mesaj] });
                return;
            }
        }
        interaction.followUp({ content: '**MISSING PERMISSION: HIST**' });
    }
}
