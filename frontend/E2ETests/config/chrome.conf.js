export default {
  maxInstances: 2,
  browserName: 'chrome',
  'goog:chromeOptions': {
    args: process.env.HEADLESS ? ['--headless', '--window-size=1920,1080'] : ['--window-size=1920,1080'],
  },
};
