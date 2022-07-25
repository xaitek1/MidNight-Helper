const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

//ROLES
let FOUNDER = '984505316630732911'
let CEO = '993535251445973012'
let CO_FOUNDER = '984505316630732913'
let DEVELOPER = '984505316630732915'
let MANAGER = '984505316630732914'
let SUPERVIZOR = '1000368593889923082'
let ADMIN = '1000369099563614330'
let MODERATOR = '984505316630732918'
let HELPER = '984505316630732919'
let TRIAL_HELPER = '1000369518465527809'
let STAFF = '984505316668493876'
let fullAccess = '988913956406063114'

module.exports = {
    name: 'kick-verify',
    description: 'generates the verify kick message',
    async execute(client, interaction){
        if (interaction.member.roles.cache.has(fullAccess)){
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
                    .setFooter(`${process.env.VERSION} • ${new Date(interaction.createdTimestamp).toLocaleDateString()}`)
            let channel = '995763425064009769'
            client.channels.cache.get(channel).send({embeds: [mesaj], components: [row]});
            interaction.followUp('mesaj de kick generat');
            return;
        }
        interaction.followUp({ content: '**MISSING PERMISSION: KICK-VERIFY**' });
    }
}