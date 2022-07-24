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

module.exports = {
    name: 'unmute',
    description: 'unmutes a member',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to be unmute',
            required: true,
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason for the unmute',
            required: true,
        },
    ],
    async execute(client, interaction){
        if (interaction.member.roles.cache.has(FOUNDER) || interaction.member.roles.cache.has(CEO) || interaction.member.roles.cache.has(CO_FOUNDER) || interaction.member.roles.cache.has(DEVELOPER) || interaction.member.roles.cache.has(MANAGER) || interaction.member.roles.cache.has(MODERATOR) || interaction.member.roles.cache.has(HELPER)){
            
            const user = interaction.options.getUser('user'); //FOLOSIT DOAR LA MEMBERTARGET
            const mutedMember = interaction.options.getUser('user'); //FOLOSIT DOAR LA NICKNAME
            if (user)
            {
                let muteRole = '984869290194903060';
                let memberTarget = interaction.guild.members.cache.get(user.id);
                var reason = interaction.options.getString('reason');
                await memberTarget.roles.remove(muteRole);
                interaction.followUp(`<@${memberTarget.user.id}> has been unmuted`);
                if (!reason)
                {
                    reason = 'No reason provided'
                }
                
                //DELETING FRMO DATABASE
                const query = {
                    userID: memberTarget.user.id,
                }
                const results = await punishmentSchema.find(query)
                for (const result of results){
                    const { type } = result
                    if (type === 'mute'){
                        await punishmentSchema.deleteMany(query)
                    }
                }

                //ARHIVA
                let arhiva = await archiveSchema.create({
                    userID: user.id,
                    staffID: interaction.user.id,
                    reason: reason,
                    type: 'unmute',
                })
                arhiva.save();

                //#SANCTIUNI
                const mesaj = new MessageEmbed()
                    .setTitle('UNMUTE')
                    .setColor('GREEN')
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
                        'Unmuted by',
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
        interaction.followUp({ content: '**MISSING PERMISSION: UNMUTE MEMBERS**' });
    }
}