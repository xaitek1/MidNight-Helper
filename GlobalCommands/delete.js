const { Client, CommandInteraction } = require('discord.js')
const punishmentSchema = require('../Models/punishment-schema');
const archiveSchema = require('../Models/archive-schema')

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
        if (interaction.member.permissions.has('ADMINISTRATOR')){
            const id = interaction.options.getString('id');
            //ARCHIVE SCHEMA
            const query = {
                _id: id,
            }
            const result = await archiveSchema.findOne(query)
            await archiveSchema.deleteMany(query)

            //PUNISHMENT SCHEMA
            const result2 = await punishmentSchema.findOne(query)
            await punishmentSchema.deleteMany(query)
            interaction.followUp(`${interaction.options.getString('id')} ID removed`);
            return;
        }
        interaction.followUp({ content: '**❌ You are not authorized to use this**' });
    }
}
