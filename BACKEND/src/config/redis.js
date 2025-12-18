import dotenv from 'dotenv';
 dotenv.config();
import {createClient} from 'redis'; 
const redisClient = createClient({ username: 'default', 
    password: process.env.REDIS_PASSWORD, 
    socket: { host: 'redis-13518.c275.us-east-1-4.ec2.cloud.redislabs.com',
        port: 13518 } }); 
export default redisClient;






