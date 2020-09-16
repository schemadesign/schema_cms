import '@babel/polyfill';
import { config } from 'dotenv';
import { cond, equals, always } from 'ramda';
import CHROME_CAPABILITIES from './chrome.conf';
import FIREFOX_CAPABILITIES from './firefox.conf';
import SAFARI_CAPABILITIES from './safari.conf';

config();

const browserCapabilities = cond([
  [equals('chrome'), always([CHROME_CAPABILITIES])],
  [equals('firefox'), always([FIREFOX_CAPABILITIES])],
  [equals('safari'), always([SAFARI_CAPABILITIES])],
  [equals('all'), always([CHROME_CAPABILITIES, FIREFOX_CAPABILITIES, SAFARI_CAPABILITIES])],
  [equals('docker'), always([CHROME_CAPABILITIES, FIREFOX_CAPABILITIES])],
]);

exports.config = {
  execArgv: process.env.DEBUG ? ['--inspect'] : [],
  runner: 'local',
  hostname: process.env.HUB_HOST,
  port: parseInt(process.env.HUB_PORT, 10),
  specs: ['./test/features/**/*.feature'],
  exclude: ['./test/pages/**/*.page.js'],
  maxInstances: process.env.DEBUG ? 1 : 2,
  capabilities: browserCapabilities(process.env.BROWSER) || [CHROME_CAPABILITIES, FIREFOX_CAPABILITIES],
  logLevel: 'info',
  bail: process.env.BAIL || 3,
  baseUrl: process.env[`${process.env.ENV}`] || process.env.STAGE,
  waitforTimeout: 30000,
  waitforInterval: 500,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: process.env.PUPPETEER ? [] : ['selenium-standalone'],
  framework: 'cucumber',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepReporting: false,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: false,
      },
    ],
  ],
  cucumberOpts: {
    require: ['./test/steps/**/*.steps.js'],
    backtrace: true,
    requireModule: [
      [
        '@babel/register',
        {
          rootMode: 'upward',
          ignore: ['node_modules'],
        },
      ],
    ],
    dryRun: false,
    failFast: false,
    format: ['pretty'],
    colors: 'true',
    snippets: true,
    source: true,
    profile: [],
    strict: false,
    tagExpression: '',
    timeout: 35000,
    ignoreUndefinedDefinitions: true,
  },
  beforeScenario() {
    browser.setWindowSize(1920, 1080);
  },
  afterScenario() {
    browser.reloadSession();
  },
};
