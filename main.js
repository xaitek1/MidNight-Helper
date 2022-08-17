//DISCORD
const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
const punishmentSchema = require('./Models/punishment-schema');
const guildCommandsSchema = require('./Models/guildCommands-schema')
const { MessageEmbed } = require('discord.js')

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
['Commands', 'Events'].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord);
})

//CHECKING WHEN MEMBER JOINS THE SERVER
client.on('guildMemberAdd', async (member) => {
    const guildId = member.guild.id;
    const results = await punishmentSchema.find({
        userID: member.id,
        guildID: guildId,
    })
    if (results.length == 0){
        if (guildId == '999749692239904929'){
            const mesaj = new MessageEmbed()
            .setColor("RED")
            .setAuthor(member.displayName, member.displayAvatarURL({dynamic: true, size: 128}))
            .setThumbnail(member.displayAvatarURL({dynamic: true, size: 128}))
            .setDescription(
                '<a:6417redcrown:993567797835735050> ◊ W E L C O M E ◊ <a:6417redcrown:993567797835735050>\n\n• [**Rules**](https://ptb.discord.com/channels/999749692239904929/999749693250744421) 📜\n• [**Self Roles**](https://ptb.discord.com/channels/999749692239904929/999749694102196260) 🎭\n• [**Roles Info**](https://ptb.discord.com/channels/999749692239904929/1001591448677920819) 📩\n\n **© Heaven Knights. All rights reserved.**'
                )
            let channel = '999749693762437187'
            await client.channels.cache.get(channel).send(`<@${member.id}>`);
            await client.channels.cache.get(channel).send({ embeds: [mesaj] });
        }
        return;
    }

    for (const result of results){
        if (result.type == 'ban'){

            const result2 = await guildCommandsSchema.findOne({
                guildID: guildId
            })
            if (!result2.bannedRole){
                return;
            }
            const banRole = result2.bannedRole

            member.roles.add(banRole);
        }
        if (result.type == 'mute'){

            const result3 = await guildCommandsSchema.findOne({
                guildID: guildId
            })
            if (!result3.mutedRole){
                return;
            }
            const muteRole = result3.mutedRole

            member.roles.add(muteRole);
        }
    }
})

client.login(process.env.TOKEN);