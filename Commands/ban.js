const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js')
const punishmentSchema = require('../Models/punishment-schema');
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
    name: 'ban',
    description: 'soft-bans a member',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to be banned',
            required: true,
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason for the ban',
            required: true,
        },
    ],
    async execute(client, interaction){
        if (interaction.member.roles.cache.has(FOUNDER) || interaction.member.roles.cache.has(CEO) || interaction.member.roles.cache.has(CO_FOUNDER) || interaction.member.roles.cache.has(DEVELOPER) || interaction.member.roles.cache.has(MANAGER) || interaction.member.roles.cache.has(SUPERVIZOR) || interaction.member.roles.cache.has(ADMIN))
        {
            const user = interaction.options.getUser('user'); //FOLOSIT DOAR LA MEMBERTARGET
            const bannedMember = interaction.options.getUser('user'); //FOLOSIT DOAR LA NICKNAME
            if (user)
            {
                const banRole = '995768278238634045';
                let memberTarget = interaction.guild.members.cache.get(user.id);
                if (memberTarget.roles.cache.has(STAFF) || memberTarget.roles.cache.has(fullAccess)){
                    return interaction.followUp('**NU INCERCA SA-TI BANEZI COLEGII BRO**');
                }
                const result = await punishmentSchema.findOne({
                    userID: user.id,
                    type: 'ban',
                })
                if (result){
                    return interaction.followUp(`<@${user.id}> is already banned.`)
                }
                var reason = interaction.options.getString('reason');
                await memberTarget.roles.remove(memberTarget.roles.cache);
                if (!reason)
                {
                    reason = 'No reason provided'
                    interaction.followUp(`<@${memberTarget.user.id}> has been banned.`);
                }
                else
                {
                    interaction.followUp(`<@${memberTarget.user.id}> has been banned for ${reason}.`);
                }
                await memberTarget.roles.add(banRole);
                
                //SANCTIUNI
                let schema = await punishmentSchema.create({
                    userID: user.id,
                    staffID: interaction.user.id,
                    reason: reason,
                    type: 'ban',
                })
                schema.save();

                //ARHIVA
                let arhiva = await archiveSchema.create({
                    userID: user.id,
                    staffID: interaction.user.id,
                    reason: reason,
                    type: 'ban',
                })
                arhiva.save();

                    //#SANCTIUNI
                    const mesaj = new MessageEmbed()
                    .setTitle('BAN')
                    .setColor('RED')
                    .setFooter(`${process.env.VERSION} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
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
                        `<@${interaction.user.id}>`,
                        true
                    )
                    .addField(
                        'Nickname',
                        interaction.user.nickname || interaction.user.tag.substring(0, interaction.user.tag.length - 5),
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
        }
        interaction.followUp({ content: '**MISSING PERMISSION: BAN MEMBERS**' });
    }
}
