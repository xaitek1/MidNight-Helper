const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js');
const punishmentSchema = require('../Models/punishment-schema');
const archiveSchema = require('../Models/archive-schema')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'soft',
    description: 'soft bans/unbans a member',
    options: [
        {
            name: 'ban',
            type: 'SUB_COMMAND',
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
        },
        {
            name: 'unban',
            type: 'SUB_COMMAND',
            description: 'soft-unbans a member',
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
        },
    ],
    async execute(client, interaction){
        const subCommand = interaction.options.getSubcommand()
        const guildId = interaction.guild.id;
        const result2 = await guildCommandsSchema.findOne({
            guildID: guildId
        })
        if (!result2.bannedRole){
            return interaction.followUp({ content: '**❌ The banned role have not been set up. Please use `/set banned-role`**' });
        }
        const banRole = result2.bannedRole

        const result3 = await guildCommandsSchema.findOne({
            guildID: guildId
        })
        if (!result3.warnsChannel){
            return interaction.followUp({ content: '**❌ The warns channel have not been set up. Please use `/set warns-channel`**' });
        }
        const channel = result3.warnsChannel

        const result4 = await guildCommandsSchema.findOne({
            guildID: guildId
        })
        if (!result4.mainRole){
            return interaction.followUp({ content: '**❌ The main role have not been set up. Please use `/set main-role`**' });
        }
        const mainRole = result4.mainRole

        if (subCommand == 'ban'){
            let ok = false
            const result = await guildCommandsSchema.findOne({
                guildID: guildId
            })
            if (!result.rolesBan){
                return interaction.followUp({ content: '**❌ You are not authorized to use this**' });
            }
            const roles = result.rolesBan.split(" ")
    
            if (interaction.member.roles.cache.some(r => roles.includes(r.id))){
                ok = true;
            }

            if (ok == true){
                const user = interaction.options.getUser('user'); //FOLOSIT DOAR LA MEMBERTARGET
                const bannedMember = interaction.options.getUser('user'); //FOLOSIT DOAR LA NICKNAME
                if (user){
                    let memberTarget = interaction.guild.members.cache.get(user.id);
                    if (memberTarget.roles.cache.some(r => roles.includes(r.id))){
                        return interaction.followUp('**CAN\'T BAN THAT MEMBER**');
                    }
                    const result = await punishmentSchema.findOne({
                        userID: user.id,
                        type: 'ban',
                    })
                    if (result){
                        return interaction.followUp(`<@${user.id}> is already banned.`)
                    }
                    var banReason = interaction.options.getString('reason');
                    await memberTarget.roles.remove(memberTarget.roles.cache);
                    if (!banReason){
                        reason = 'No reason provided'
                        interaction.followUp(`<@${memberTarget.user.id}> has been banned.`);
                    }
                    else{
                        interaction.followUp(`<@${memberTarget.user.id}> has been banned for ${banReason}.`);
                    }
                    await memberTarget.roles.add(banRole);
                    
                    //SANCTIUNI
                    let schema = await punishmentSchema.create({
                        userID: user.id,
                        staffID: interaction.user.id,
                        reason: banReason,
                        type: 'ban',
                    })
                    schema.save();
    
                    //ARHIVA
                    let arhiva = await archiveSchema.create({
                        userID: user.id,
                        staffID: interaction.user.id,
                        reason: banReason,
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
                            `${banReason}`,
                            true
                        )
                        client.channels.cache.get(channel).send({ embeds: [mesaj] });
                        return;
                }
            }
            interaction.followUp({ content: '**❌ You are not authorized to use this**' });
        }
        else{
            let ok = false
            const result = await guildCommandsSchema.findOne({
                guildID: guildId
            })
            if (!result.rolesUnban){
                return interaction.followUp({ content: '**❌ You are not authorized to use this**' });
            }
            const roles = result.rolesUnban.split(" ")
    
            if (interaction.member.roles.cache.some(r => roles.includes(r.id))){
                ok = true;
            }
            if (ok == true){
                const user = interaction.options.getUser('user'); //FOLOSIT DOAR LA MEMBERTARGET
                const bannedMember = interaction.options.getUser('user'); //FOLOSIT DOAR LA NICKNAME
                if (user){
                    let memberTarget = interaction.guild.members.cache.get(user.id);
                    var unbanReason = interaction.options.getString('reason');
                    await memberTarget.roles.add(mainRole);
                    await memberTarget.roles.remove(banRole);
                    await interaction.followUp(`<@${memberTarget.user.id}> has been unbanned.`);
                    if (!unbanReason){
                        unbanReason = 'No reason provided'
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
                        reason: unbanReason,
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
                            `${unbanReason}`,
                            true
                        )
                        client.channels.cache.get(channel).send({ embeds: [mesaj] });
                        return;
                }
            }
            interaction.followUp({ content: '**❌ You are not authorized to use this**' });
        }
    }
};