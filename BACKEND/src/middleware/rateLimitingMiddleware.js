import redisClient from '../config/redis.js';

const rateLimitingMiddleware = async (req, res, next) => {
  const key = `rate_limit:${req.result._id}`;
  const count = await redisClient.incr(key);
  if (count === 1) {
    await redisClient.expire(key, 60);
  }
  if (count > 5) {
    const ttl = await redisClient.ttl(key);
    return res.status(429).json({ message: `Try again in ${ttl} seconds` });
  }
  next();
};

export default rateLimitingMiddleware;
