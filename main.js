//DISCORD
const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MEMBERS"]});
const punishmentSchema = require('./Models/punishment-schema');
const banRole = '995768278238634045';
const muteRole = '984869290194903060';
const kickedRole = '995762751593009322'

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