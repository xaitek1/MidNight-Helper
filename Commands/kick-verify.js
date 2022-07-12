const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'kick-verify',
    description: 'generates the verify kick message',
    async execute(message, client){
        if (message.member.roles.cache.has('988913956406063114')){
            var row = new MessageActionRow()
                .addComponents(new MessageButton()
                .setCustomId("verify")
                .setLabel("Verify")
                .setEmoji("📩")
                .setStyle("PRIMARY")
            );
            const mesaj = new MessageEmbed()
                    .setTitle('You have been soft-kicked')
                    .setDescription('Daca vezi asta inseamna ca ai primit kick.\nPentru a avea din nou acces la server apasa pe butonul de mai jos.')
                    .setColor('RED')
            let channel = '995763425064009769'
            message.client.channels.cache.get(channel).send({embeds: [mesaj], components: [row]});
            message.channel.send('mesaj de kick generat');
            return;
        }
        message.reply("Missing permission: **KICK VERIFY**")
        .then(message => {
            setTimeout(() => message.delete(), 5000);
        })
    }
}