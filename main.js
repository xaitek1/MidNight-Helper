//DISCORD
const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MEMBERS"]});
const punishmentSchema = require('./Models/punishment-schema');
const banRole = '995768278238634045';
const muteRole = '984869290194903060';
const kickedRole = '995762751593009322'
const { MessageEmbed } = require('discord.js')

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
['Commands', 'Events'].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord);
})

//CHECKING WHEN MEMBER JOINS THE SERVER
client.on('guildMemberAdd', async (member) => {
    const results = await punishmentSchema.find({
        userID: member.id,
    })
    if (results.length == 0){
        const mesaj = new MessageEmbed()
        .setColor("RED")
        .setAuthor(member.displayName, member.displayAvatarURL({dynamic: true, size: 128}))
        .setThumbnail(member.displayAvatarURL({dynamic: true, size: 128}))
        .setDescription(
            '<a:6417redcrown:993567797835735050> ◊ W E L C O M E ◊ <a:6417redcrown:993567797835735050>\n\n• [**Rules**](https://ptb.discord.com/channels/984505316462981190/984505317729640493) 📜\n• [**Self Roles**](https://ptb.discord.com/channels/984505316462981190/984505318056816705) 🎭\n• [**Staff Apply**](https://ptb.discord.com/channels/984505316462981190/984770859317207090) 📩\n\n **© MidNight Community. All rights reserved.**'
            )
        let channel = '984893277629202442'
        await client.channels.cache.get(channel).send(`<@${member.id}>`);
        await client.channels.cache.get(channel).send({ embeds: [mesaj] });
        return;
    }
    for (const result of results){
        if (result.type == 'ban'){
            member.roles.add(banRole);
        }
        if (result.type == 'mute'){
            member.roles.add(muteRole);
        }
        if (result.type == 'kick'){
            member.roles.add(kickedRole);
        }
    }
})

client.login(process.env.TOKEN);