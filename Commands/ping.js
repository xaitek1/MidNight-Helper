module.exports = {
    name: 'ping',
    description: 'shows the ping of the bot',
    execute(message){
        //message.channel.send(`Ping is ${client.ws.ping}`);
            const ping = message.createdTimestamp - Date.now()
            message.channel.send(`Bot latency: ${ping}`)
    }
};