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
let fullAccess = '988913956406063114'

module.exports = {
    name: 'unban',
    description: 'unbans a member',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to be unbanned',
            required: true,
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason for the unban',
            required: true,
        },
    ],
    async execute(client, interaction){
        if (interaction.member.roles.cache.has(FOUNDER) || interaction.member.roles.cache.has(CEO) || interaction.member.roles.cache.has(CO_FOUNDER) || interaction.member.roles.cache.has(DEVELOPER) || interaction.member.roles.cache.has(MANAGER)){
            const user = interaction.options.getUser('user'); //FOLOSIT DOAR LA MEMBERTARGET
            const bannedMember = interaction.options.getUser('user'); //FOLOSIT DOAR LA NICKNAME
            if (user)
            {
                let banRole = '995768278238634045';
                let memberTarget = interaction.guild.members.cache.get(user.id);
                let mainRole = '984505316731420821';
                var reason = interaction.options.getString('reason');
                await memberTarget.roles.add(mainRole);
                await memberTarget.roles.remove(banRole);
                await interaction.followUp(`<@${memberTarget.user.id}> has been unbanned.`);
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

                //ARHIVA
                let arhiva = await archiveSchema.create({
                    userID: user.id,
                    staffID: interaction.user.id,
                    reason: reason,
                    type: 'unban',
                })
                arhiva.save();

                //#SANCTIUNI
                const mesaj = new MessageEmbed()
                    .setTitle('UNBAN')
                    .setColor('GREEN')
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
                        'Unbanned by',
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
        interaction.followUp({ content: '**MISSING PERMISSION: UNBAN MEMBERS**' });
    }
};