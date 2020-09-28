export default {
  maxInstances: 1,
  browserName: 'chrome',
  'goog:chromeOptions': {
    args: process.env.HEADLESS
      ? ['--headless', '--no-sandbox', '--window-size=1920,1080']
      : ['--window-size=1920,1080'],
  },
};
