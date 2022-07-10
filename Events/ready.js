module.exports = {
    name: 'ready',
    description: 'on startup',
    on: true,
    execute (client){
        console.log('MidNight Bot online!');
        client.user.setActivity('over MidNight Community', { type: 'WATCHING'});
        client.user.setStatus('online');
    }
}