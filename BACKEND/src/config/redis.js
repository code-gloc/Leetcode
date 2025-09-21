import dotenv from 'dotenv';
 dotenv.config();
import {createClient} from 'redis'; 
const redisClient = createClient({ username: 'default', 
    password: process.env.REDIS_PASSWORD, 
    socket: { host: 'redis-11615.c212.ap-south-1-1.ec2.redns.redis-cloud.com', 
        port: 11615 } }); 
export default redisClient;
