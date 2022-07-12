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
    execute(message, args){
            if (message.member.roles.cache.has(FOUNDER) || message.member.roles.cache.has(CEO) || message.member.roles.cache.has(CO_FOUNDER) || message.member.roles.cache.has(DEVELOPER) || message.member.roles.cache.has(MANAGER) || message.member.roles.cache.has(MODERATOR)){
                if (!args[0]){
                        return message.channel.send('Nu ai scris cate mesaje');
                    }
                if (args[0] > 100){
                    args[0] = 100;
                }
                if (isNaN(args[0])){
                    return message.channel.send('Nu ai scris un numar valid');
                }
                var amount = parseInt(args[0]);
                message.channel.bulkDelete(amount+1);
                message.channel.send('✅')
                .then(message => {
                    setTimeout(() => message.delete(), 5000);
                })
                return;
        }
        message.reply("Missing permission: **PURGE MESSAGES**")
        .then(message => {
            setTimeout(() => message.delete(), 5000);
        })
    }
}