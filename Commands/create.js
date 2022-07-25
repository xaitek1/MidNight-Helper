const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js')

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
    name: 'create',
    description: 'creates and sends a custom embed',
    options: [
        {
            name: 'title',
            type: 'STRING',
            description: 'The title of the embed',
            required: true,
        },
        {
            name: 'description',
            type: 'STRING',
            description: 'The content of the embed',
            required: true,
        },
        {
            name: 'color',
            type: 3,
            description: 'The color of the embed',
            required: true,
            choices: [
                {
                    name: 'AQUA',
                    value: 'AQUA',
                },
                {
                    name: 'BLUE',
                    value: 'BLUE',
                },
                {
                    name: 'BLURPLE',
                    value: 'BLURPLE',
                },
                {
                    name: 'DARK BUT NOT BLACK',
                    value: 'DARK_BUT_NOT_BLACK',
                },
                {
                    name: 'DARK GREEN',
                    value: 'DARK_GREEN',
                },
                {
                    name: 'DARK GREY',
                    value: 'DARK_GREY',
                },
                {
                    name: 'DARK NAVY',
                    value: 'DARK_NAVY',
                },
                {
                    name: 'DARK ORANGE',
                    value: 'DARK_ORANGE',
                },
                {
                    name: 'DARK PURPLE',
                    value: 'DARK_PURPLE',
                },
                {
                    name: 'DARK RED',
                    value: 'DARK_RED',
                },
                {
                    name: 'DARK VIVID PINK',
                    value: 'DARK_VIVID_PINK',
                },
                {
                    name: 'DEFAULT',
                    value: 'DEFAULT',
                },
                {
                    name: 'GOLD',
                    value: 'GOLD',
                },
                {
                    name: 'GREEN',
                    value: 'GREEN',
                },
                {
                    name: 'GREY',
                    value: 'GREY',
                },
                {
                    name: 'GREYPLE',
                    value: 'GREYPLE',
                },
                {
                    name: 'LIGHT GREY',
                    value: 'LIGHT_GREY',
                },
                {
                    name: 'NAVY',
                    value: 'NAVY',
                },
                {
                    name: 'NOT QUITE BLACK',
                    value: 'NOT_QUITE_BLACK',
                },
                {
                    name: 'ORANGE',
                    value: 'ORANGE',
                },
                {
                    name: 'PURPLE',
                    value: 'PURPLE',
                },
                {
                    name: 'RANDOM',
                    value: 'RANDOM',
                },
                {
                    name: 'RED',
                    value: 'RED',
                },
                {
                    name: 'WHITE',
                    value: 'WHITE',
                },
                {
                    name: 'YELLOW',
                    value: 'YELLOW',
                },
            ],
        },
    ],
    async execute (client, interaction){
        if (interaction.member.roles.cache.has(FOUNDER) || interaction.member.roles.cache.has(CEO) || interaction.member.roles.cache.has(CO_FOUNDER) || interaction.member.roles.cache.has(DEVELOPER) || interaction.member.roles.cache.has(MANAGER) || interaction.member.roles.cache.has(SUPERVIZOR) || interaction.member.roles.cache.has(ADMIN)){
            const title = interaction.options.getString('title')
            const desc = interaction.options.getString('description')
            const color = interaction.options.getString('color');
            const mesaj = new MessageEmbed()
            .setTitle(`${title}`)
            .setDescription(`${desc}`)
            .setColor(`${color}`)
            .setFooter('© - All rights reserved to cretu & Midnight Community. EST. 2022')
            interaction.followUp({ embeds: [mesaj] });
            return;
        }
        interaction.followUp({ content: '**MISSING PERMISSION: CREATE EMBEDS**' });
    }
}
