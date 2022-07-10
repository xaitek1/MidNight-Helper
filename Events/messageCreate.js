require('dotenv').config();

const PREFIX = process.env.PREFIX_BOT

module.exports = {
    name: "messageCreate",
    description: "commands",
    on: true,
    execute(message, client, Discord){
        if (!message.content.startsWith(PREFIX) || message.author.bot){
            return;
        }
        let args = message.content.slice(PREFIX.length).split(' ');
    
        const cmd = args.shift().toLowerCase();
        const command = client.commands.get(cmd);
        if (command){
            command.execute(message, args, client, Discord);
        }
    }
}