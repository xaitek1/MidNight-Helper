const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'ticket-unban',
    description: 'generates the unban ticket',
    async execute(message, client){
        if (message.member.roles.cache.has('988913956406063114')){
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
                    .setFooter(`${process.env.VERSION} • ${new Date(message.createdTimestamp).toLocaleDateString()}`)
            let channel = '995768254578565140'
            message.client.channels.cache.get(channel).send({embeds: [mesaj], components: [row]});
            message.channel.send('Unban ticket generat');
            return;
        }
        message.reply("Missing permission: **TICKET UNBAN**")
        .then(message => {
            setTimeout(() => message.delete(), 5000);
        })
    }
}