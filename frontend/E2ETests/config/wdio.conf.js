require('@babel/register')({
  presets: ['@babel/env'],
});

module.exports = require('./wdio.main.conf');
