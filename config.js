module.exports = {
  MONGO_USERNAME: process.env.MONGO_USERNAME || "fundo",
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || "password",
  MONGO_PORT: process.env.MONGO_PORT || 27017,
  MONGO_URL: process.env.MONGO_URL || "mongo",
  NODE_PORT: process.env.NODE_PORT || 3000,
};
