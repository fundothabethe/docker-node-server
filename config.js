module.exports = {
  MONGO_USERNAME: process.env.MONGO_USERNAME || "fundo",
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || "password",
  MONGO_PORT: process.env.MONGO_PORT || 27017,
  MONGO_URL: process.env.MONGO_URL || "mongo",
  NODE_PORT: process.env.NODE_PORT || 3000,
  REDIS_URL: process.env.REDIS_URL || "redis",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_USERNAME: process.env.REDIS_USERNAME || "default",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "password",
  REDIS_SECRET: process.env.REDIS_SECRET || "secret",
};
