const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

//ROLES
let FOUNDER = '984505316630732911'
let CEO = '993535251445973012'
let CO_FOUNDER = '984505316630732913'
let DEVELOPER = '984505316630732915'
let MANAGER = '984505316630732914'
let MODERATOR = '984505316630732918'
let HELPER = '984505316630732919'
let everyone = '984505316462981190'

module.exports = {
    name: 'interactionCreate',
    description: 'tickets',
    on: true,
    async execute(interaction){
        /*

        TICKET - UNBAN

        */
        const { client } = interaction;
        if (interaction.isButton()){
            if (interaction.customId === "open-ticket"){
                let canalStaffNotif = '995777244280668180'
                let user = interaction.member.id;
                let nameOfChannel = "unban-" + user;
                if ((interaction.guild.channels.cache.find(c => c.name === nameOfChannel))){
                    return;
                }
                await interaction.guild.channels.create(`unban-${user}}`, {
                    parent: '995763525018452108',
                    permissionOverwrites: [
                        {
                            id: user,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                        },
                        {
                            id: MANAGER,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                        },
                        {
                            id: everyone,
                            deny: ['VIEW_CHANNEL']
                        }
                    ]
                }).then(async channel => {
                    var row = new MessageActionRow()
                    .addComponents(new MessageButton()
                    .setCustomId("close-ticket")
                    .setLabel("Inchide ticketul")
                    .setStyle("DANGER")
                    );
                    const mesaj = new MessageEmbed()
                    .setTitle('Ticket')
                    .setDescription('Un membru staff iti va prelua cererea imediat ce va fi notificat.')
                    .setColor('RED')
                    await channel.send({content: `<@${user}> Aici este ticketul tau`, embeds: [mesaj], components: [row]});
                    await client.channels.cache.get(canalStaffNotif).send(`<@&984505316668493876> membrul <@${user}> a deschis cererea de unban <#${channel.id}>`)
                });
            }
            else if (interaction.customId === "close-ticket" && (interaction.member.roles.cache.has(MANAGER) || interaction.member.roles.cache.has(DEVELOPER) || interaction.member.roles.cache.has(CO_FOUNDER) || interaction.member.roles.cache.has(CEO) || interaction.member.roles.cache.has(FOUNDER))){
                interaction.channel.setParent("995774832933359629");
    
                var row = new MessageActionRow()
                .addComponents(new MessageButton()
                .setCustomId("delete-ticket")
                .setLabel("Sterge ticketul")
                .setStyle("DANGER")
                );
                const mesaj = new MessageEmbed()
                    .setTitle('Mod menu')
                    .setColor('RED')
                interaction.message.delete();
                interaction.channel.send({embeds: [mesaj], components: [row]});
                interaction.reply({content: "ticket arhivat", ephemeral: true});
            }
            else if (interaction.customId === "delete-ticket"){
                interaction.channel.delete();
            }
        }

        /*

        KICK - VERIFY

        */
        if (interaction.isButton()){
            if (interaction.customId === "verify"){
                let canalStaffNotif = '995777244280668180'
                let user = interaction.member.id;
                let member = interaction.member
                let mainRole = '984505316731420821'
                let kickedRole = '995762751593009322'
                member.roles.add(mainRole);
                member.roles.remove(kickedRole);
                await client.channels.cache.get(canalStaffNotif).send(`Membrul <@${user}> s-a verificat dupa kick.`);
            }
        }
    }
}