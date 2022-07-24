const { Client, CommandInteraction } = require('discord.js')

//ROLES
let FOUNDER = '984505316630732911'
let CEO = '993535251445973012'
let CO_FOUNDER = '984505316630732913'
let DEVELOPER = '984505316630732915'
let MANAGER = '984505316630732914'
let MODERATOR = '984505316630732918'
let HELPER = '984505316630732919'

module.exports = {
    name: 'purge',
    description: 'deletes messages',
    options: [
        {
            name: 'amount',
            type: 'STRING',
            description: 'The amount of messages to be deleted',
            required: true,
        },
        {
            name: 'user',
            type: 'USER',
            description: 'The user of which messages to be deleted',
            required: false,
        },
    ],
    async execute(client, interaction){
            if (interaction.member.roles.cache.has(FOUNDER) || interaction.member.roles.cache.has(CEO) || interaction.member.roles.cache.has(CO_FOUNDER) || interaction.member.roles.cache.has(DEVELOPER) || interaction.member.roles.cache.has(MANAGER) || interaction.member.roles.cache.has(MODERATOR)){
                var amount = parseInt(interaction.options.getString('amount'));
                if (amount > 100){
                    amount = 100;
                }
                if (isNaN(amount)){
                    return interaction.followUp('Nu ai scris un numar valid');
                }
                const Messages = await interaction.channel.messages.fetch();
                const target = interaction.options.getUser('user');
                const channel = interaction.channel.id;
                if (target){
                    let i = 0;
                    const filtered = [];
                    (await Messages).filter((m) => {
                        if (m.author.id === target.id && amount > i){
                            filtered.push(m);
                            i++;
                        }
                    })
                    await interaction.channel.bulkDelete(filtered, true);
                    await client.channels.cache.get(channel).send('✅')
                    .then(message => {
                        setTimeout(() => message.delete(), 5000);
                    })
                    return;
                }
                else{
                    await interaction.channel.bulkDelete(amount+1);
                    await client.channels.cache.get(channel).send('✅')
                    .then(message => {
                        setTimeout(() => message.delete(), 5000);
                    })
                    return;
            }
        }
        interaction.followUp({ content: '**MISSING PERMISSION: PURGE MESSAGES**' });
    }
}