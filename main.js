//DISCORD
const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MEMBERS"]});
const mongoose = require('mongoose');
const punishmentSchema = require('./Models/punishment-schema');
const banRole = '995768278238634045';
const muteRole = '984869290194903060';
const kickedRole = '995762751593009322'

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
['commandHandler', 'eventHandler'].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord);
})

//CHECKING WHEN MEMBER JOINS THE SERVER
client.on('guildMemberAdd', async (member) => {
    const result = await punishmentSchema.findOne({
        userID: member.id,
        type: 'ban',
    })
    if (result){
        await member.roles.add(banRole);
    }

    const result2 = await punishmentSchema.findOne({
        userID: member.id,
        type: 'mute',
    })
    if (result2){
        await member.roles.add(muteRole);
    }

    const result3 = await punishmentSchema.findOne({
        userID: member.id,
        type: 'kick',
    })
    if (result3){
        await member.roles.add(kickedRole);
    }
})

client.login(process.env.TOKEN);