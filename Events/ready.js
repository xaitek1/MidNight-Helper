const { mongoose } = require("mongoose");
const punishmentSchema = require('../Models/punishment-schema');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ready',
    description: 'on startup | expired punishments',
    on: true,
    async execute (client){
        console.log('MidNight Bot online!');

        await mongoose.connect(process.env.MONGO_URI, {
            keepAlive: true
        }).then(() => {
            console.log('Connected to the database!')
        }).catch((err) => {
            console.log(err);
        });
        
        client.user.setActivity('over MidNight Community', { type: 'WATCHING'});
        client.user.setStatus('online');

        // CHECK FOR EXPIRED PUNISHMENTS
        const check = async () => {
            console.log('Checking database!')
            const query = {
                expires: { $lt: new Date() },
            }
            const results = await punishmentSchema.find(query)
            for (const result of results){
                const { userID, type } = result
                const guild = client.guilds.cache.get('984505316462981190')
                if (!await guild.members.cache.get(userID)){
                    await punishmentSchema.deleteMany(query)
                    setTimeout(check, 1000 * 60)
                }
                const muteRole = guild.roles.cache.get('984869290194903060')
                const memberTarget = await guild.members.fetch(userID)
                if (type === 'mute'){
                    memberTarget.roles.remove(muteRole)

                    //#SANCTIUNI
                    const mesaj = new MessageEmbed()
                    .setTitle('UNMUTE')
                    .setColor('GREEN')
                    .setFooter(`${process.env.VERSION}`)
                    .addField(
                        'ID',
                        `${memberTarget.id}`,
                        true
                    )
                    .addField(
                        'Mention',
                        `<@${memberTarget.id}>`,
                        true
                    )
                    .addField(
                        'Unmuted by',
                        'MidNight Bot',
                        true
                    )
                    .addField(
                        'Reason',
                        'Mute expired',
                        true
                    )
                    let channel = '995766750266278019'
                    client.channels.cache.get(channel).send({ embeds: [mesaj] });
                }
            }
            await punishmentSchema.deleteMany(query)
            setTimeout(check, 2000 * 60)
        }
        check()
    }
}