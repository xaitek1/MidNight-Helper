const fs = require('fs');

module.exports = (client) => {
    const commandFiles = fs.readdirSync('./Commands/').filter(file => file.endsWith('.js'));

    for (const file of commandFiles){
        const command = require(`../Commands/${file}`);
        if (command.name){
            client.commands.set(command.name, command);
        }
        else{
            continue;
        }
    }
}