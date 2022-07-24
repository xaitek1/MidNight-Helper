const fs = require('fs');

module.exports = (client) => {
    const commandFiles = fs.readdirSync('./Commands/').filter(file => file.endsWith('.js'));

    const commandsArray = [];
    for (const file of commandFiles){
        const command = require(`../Commands/${file}`);
        client.commands.set(command.name, command);
        commandsArray.push(command);
        client.on('ready', () => {
            client.commands.set(commandsArray);
        })
    }
}
