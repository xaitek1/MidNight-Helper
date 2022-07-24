const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

//ROLES
let FOUNDER = '984505316630732911'
let CEO = '993535251445973012'
let CO_FOUNDER = '984505316630732913'
let DEVELOPER = '984505316630732915'
let MANAGER = '984505316630732914'
let MODERATOR = '984505316630732918'
let HELPER = '984505316630732919'
let STAFF = '984505316668493876'
let fullAccess = '988913956406063114'

module.exports = {
    name: 'ticket-unban',
    description: 'generates the unban ticket',
    async execute(client, interaction){
        if (interaction.member.roles.cache.has(fullAccess)){
            var row = new MessageActionRow()
                .addComponents(new MessageButton()
                .setCustomId("open-ticket")
                .setLabel("Open ticket")
                .setEmoji("📩")
                .setStyle("PRIMARY")
            );
            const mesaj = new MessageEmbed()
                    .setTitle('Cerere unban')
                    .setDescription('Daca vezi asta inseamna ca esti banat.\nPentru a face o cerere de unban, te rugam sa apesi pe butonul de mai jos.')
                    .setColor('RED')
                    .setFooter(`${process.env.VERSION} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
            let channel = '995768254578565140'
            client.channels.cache.get(channel).send({embeds: [mesaj], components: [row]});
            interaction.followUp('Unban ticket generat');
            return;
        }
    }
}