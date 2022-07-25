const { Client, CommandInteraction } = require('discord.js')
const punishmentSchema = require('../Models/punishment-schema');
const archiveSchema = require('../Models/archive-schema')

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
    name: 'delete',
    description: 'deletes an id from the database',
    options: [
        {
            name: 'id',
            type: 'STRING',
            description: 'The ID to be deleted',
            required: true,
        },
    ],
    async execute (client, interaction){
        if (interaction.member.roles.cache.has(FOUNDER) || interaction.member.roles.cache.has(fullAccess))
        {
            const id = interaction.options.getString('id');
            //ARCHIVE SCHEMA
            const query = {
                _id: id,
            }
            const result = await archiveSchema.findOne(query)
            await archiveSchema.deleteMany(query)

            //PUNISHMENT SCHEMA
            const query2 = {
                _id: id,
            }
            const result2 = await punishmentSchema.findOne(query)
            await punishmentSchema.deleteMany(query)
            interaction.followUp(`${interaction.options.getString('id')} ID removed`);
            return;
        }
        interaction.followUp({ content: '**MISSING PERMISSION: DELETE**' });
    }
}
