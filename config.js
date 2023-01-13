module.exports = {
  MONGO_USERNAME: process.env.MONGO_USER_NAME || "fundo",
  MONGO_PASSWORD: process.env.MONGO_USER_PASSWORD || "password",
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || "mongo",
  MONGO_PORT: process.env.MONGO_PORT || 27017,
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_URL: process.env.REDIS_URL || "redis",
};
