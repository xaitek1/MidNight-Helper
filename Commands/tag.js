const { Client, CommandInteraction } = require('discord.js')

module.exports = {
    name: 'tag',
    description: 'shows the tags',
    execute(client, interaction){
        interaction.followUp('ﾉᴹⁱᵈᴺ, ᵐⁿ, ᴹⁱᵈᴺ');
    }
}