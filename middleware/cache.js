const Cache = require("../config/redis");

const cacheHandler = async (req, res, next) => {
    const cacheKey = req.originalUrl
    const cacheData = await Cache.redis.get(cacheKey);
    if (cacheData) {
        return res.status(200).json(JSON.parse(cacheData))
    }
    next()
}

module.exports = cacheHandler;
