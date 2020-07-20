// tiny wrapper with default env vars
module.exports = {
  NODE_ENV: '',
  PRODUCTION: "production",
  DEVELOPMENT: "development",
  PORT: (process.env.PORT || 3000)
};
