const { Client, CommandInteraction } = require('discord.js')
const ms = require('ms');
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
    name: 'mute',
    description: 'mutes a member',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to be muted',
            required: true,
        },
        {
            name: 'duration',
            type: 'STRING',
            description: 'The duration of the mute',
            required: true,
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason for the mute',
            required: true,
        },
    ],
    async execute(client, interaction){
        if (interaction.member.roles.cache.has(FOUNDER) || interaction.member.roles.cache.has(CEO) || interaction.member.roles.cache.has(CO_FOUNDER) || interaction.member.roles.cache.has(DEVELOPER) || interaction.member.roles.cache.has(MANAGER) || interaction.member.roles.cache.has(MODERATOR) || interaction.member.roles.cache.has(HELPER))
        {
            const user = interaction.options.getUser('user'); //FOLOSIT DOAR LA MEMBERTARGET
            const mutedMember = interaction.options.getUser('user'); //FOLOSIT DOAR LA NICKNAME
            if (user)
            {
                const muteRole = '984869290194903060';
                let memberTarget = interaction.guild.members.cache.get(user.id);
                if (memberTarget.roles.cache.has(STAFF) || memberTarget.roles.cache.has(fullAccess)){
                    return interaction.followUp('**NU INCERCA SA-TI DAI MUTE LA COLEGI BRO**');
                }
                const result = await punishmentSchema.findOne({
                    userID: user.id,
                    type: 'mute',
                })
                if (result){
                    return interaction.followUp(`<@${user.id}> is already muted.`)
                }
                var time = interaction.options.getString('duration');
                var reason = interaction.options.getString('reason');
                if (!containsNumber(time)){
                    return interaction.followUp('Invalid format');
                }
                let split = time.match(/\d+|\D+/g)
                let time2 = parseInt(split[0])
                let type = split[1].toLowerCase();
                if (type === 'h'){
                    time2 *= 60;
                }
                else if (type === 'd'){
                    time2 *= 60 * 24
                }
                else if (type !== 'm'){
                    return interaction.followUp('Invalid format.');
                }

                if (!time)
                {
                    return interaction.followUp('Time not specified.');
                }
                if (!reason)
                {
                    reason = 'No reason provided'
                    interaction.followUp(`<@${memberTarget.user.id}> has been muted for ${ms(ms(time))}`);
                }
                else
                {
                    interaction.followUp(`<@${memberTarget.user.id}> has been muted for ${reason}, ${ms(ms(time))}`);
                }

                await memberTarget.roles.add(muteRole);
                
                //SANCTIUNI
                const expires1 = new Date()
                expires1.setMinutes(expires1.getMinutes() + time2)
                let schema = await punishmentSchema.create({
                    userID: user.id,
                    staffID: interaction.user.id,
                    reason: reason,
                    expires: expires1,
                    type: 'mute',
                })
                schema.save();

                //ARHIVA
                let arhiva = await archiveSchema.create({
                    userID: user.id,
                    staffID: interaction.user.id,
                    reason: reason,
                    type: 'mute',
                })
                arhiva.save();
                
                //#SANCTIUNI
                const mesaj = new MessageEmbed()
                    .setTitle('MUTE')
                    .setColor('RED')
                    .setFooter(`${process.env.VERSION} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
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
                        'Muted by',
                        `<@${interaction.user.id}>`,
                        true
                    )
                    .addField(
                        'Nickname',
                        interaction.user.nickname ||interaction.user.tag.substring(0, interaction.user.tag.length - 5),
                        true
                    )
                    .addField(
                        'Reason',
                        `${reason}`,
                        true
                    )
                    .addField(
                        'Time',
                        `${time}`,
                        true
                    )
                    client.channels.cache.get('995766750266278019').send({ embeds: [mesaj] });
                    return;
            }
        }
    }
}

function containsNumber(str) {
    return /\d/.test(str);
  }