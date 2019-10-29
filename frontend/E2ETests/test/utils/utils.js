import { TIMEOUT } from './../constants/config.constants.js';

export const waitForElement = (that, elemName, timeout = TIMEOUT) => {
    browser.waitUntil(() => that[elemName].isDisplayed(),timeout, `${elemName} not load after 10 seconds`);
}

export const waitForText = (that, elemName, text, timeout = TIMEOUT) => {
    browser.waitUntil(() => that[elemName].getText() === text, timeout, `Text of ${elemName} doesn't equal ${text}`);
}

export const camelCase = str =>
  str
    .replace(/\s(.)/g, a => a.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, b => b.toLowerCase()); 
