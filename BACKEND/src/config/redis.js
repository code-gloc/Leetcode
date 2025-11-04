import dotenv from 'dotenv';
 dotenv.config();
import {createClient} from 'redis'; 
const redisClient = createClient({ username: 'default', 
    password: process.env.REDIS_PASSWORD, 
    socket: { host: 'redis-10551.crce217.ap-south-1-1.ec2.redns.redis-cloud.com', 
        port: 10551 } }); 
export default redisClient;



// import { createClient } from 'redis';

// const client = createClient({
//     username: 'default',
//     password: 'qiUNgJK8343Ht1FzSOoczWzlbT0CE6Cw',
//     socket: {
//         host: 'redis-10551.crce217.ap-south-1-1.ec2.redns.redis-cloud.com',
//         port: 10551
//     }
// });

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar








