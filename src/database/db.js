import { createClient } from 'redis';

const client = createClient({
    socket:{
        host: 'localhost',
        port: 6379
    }
});

client.on('error', (err) => console.log('Error', err))

if(!client.isOpen){
    client.connect()
}

export default client;
