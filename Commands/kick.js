const { Client, CommandInteraction } = require('discord.js')
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
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to be kicked',
            required: true,
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason for the kick',
            required: true,
        },
    ],
    async execute(client, interaction){
        if (interaction.member.roles.cache.has(FOUNDER) || interaction.member.roles.cache.has(CEO) || interaction.member.roles.cache.has(CO_FOUNDER) || interaction.member.roles.cache.has(DEVELOPER) || interaction.member.roles.cache.has(MANAGER) || interaction.member.roles.cache.has(MODERATOR)){
            const user = interaction.options.getUser('user'); //FOLOSIT DOAR LA MEMBERTARGET
            const kickedMember = interaction.options.getUser('user'); //FOLOSIT DOAR LA NICKNAME
            if (!user){
                return interaction.followUp('Can\'t find that member')
            }
            let memberTarget = interaction.guild.members.cache.get(user.id);
            if (memberTarget.roles.cache.has(STAFF) || memberTarget.roles.cache.has(fullAccess)){
                return interaction.followUp('**NU INCERCA SA-TI DAI KICK LA COLEGI BRO**');
            }
            const result = await punishmentSchema.findOne({
                userID: user.id,
                type: 'kick',
            })
            if (result){
                return interaction.followUp(`<@${user.id}> is already kicked.`)
            }
            const kickedRole = '995762751593009322'
            var reason = interaction.options.getString('reason');
            if (!reason){
                reason = 'No reason provided'
            }
            interaction.followUp(`<@${user.id}> was kicked by <@${interaction.user.id}>`)
            await memberTarget.roles.remove(memberTarget.roles.cache);
            await memberTarget.roles.add(kickedRole)
            memberTarget.roles.add(kickedRole);
            
            //SANCTIUNI
            let schema = await punishmentSchema.create({
                userID: user.id,
                staffID: interaction.user.id,
                reason: reason,
                type: 'kick',
            })
            schema.save();

            //ARHIVA
            let arhiva = await archiveSchema.create({
                userID: user.id,
                staffID: interaction.user.id,
                reason: reason,
                type: 'kick',
            })
            arhiva.save();

            //#SANCTIUNI
            const mesaj = new MessageEmbed()
                .setTitle('KICK')
                .setColor('RED')
                .setFooter(`${process.env.VERSION} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
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
        interaction.followUp({ content: '**MISSING PERMISSION: KICK**' });
    }
}