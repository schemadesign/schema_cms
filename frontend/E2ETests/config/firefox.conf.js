export default {
  maxInstances: 1,
  browserName: 'firefox',
  'moz:firefoxOptions': {
    args: process.env.HEADLESS ? ['--headless'] : [],
  },
};
