import dotenv from 'dotenv';
 dotenv.config();
import {createClient} from 'redis'; 
const redisClient = createClient({ username: 'default', 
    password: process.env.REDIS_PASSWORD, 
    socket: {
        host: 'redis-18751.c245.us-east-1-3.ec2.cloud.redislabs.com',
        port: 18751
    }
}); 
export default redisClient;


