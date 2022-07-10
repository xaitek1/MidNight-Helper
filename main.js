//DISCORD
const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"]});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
['commandHandler', 'eventHandler'].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord);
})

client.login(process.env.TOKEN);