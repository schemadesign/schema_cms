require('@babel/register')({
  presets: ['@babel/preset-env'],
});

module.exports = require('./wdio.conf.main');
