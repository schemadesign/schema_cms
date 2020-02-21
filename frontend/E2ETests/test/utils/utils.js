import { TIMEOUT } from '../constants/config.constants';

export const waitForElement = (that, elemName, timeout = TIMEOUT) => {
  browser.waitUntil(() => that[elemName].isDisplayed(), timeout, `${elemName} not load after ${timeout} miliseconds`);
};

export const waitForText = (that, elemName, text, timeout = TIMEOUT) => {
  browser.waitUntil(
    () => that[elemName].getText() === text,
    timeout,
    `Text of ${elemName} equals ${that[elemName].getText()} while it should equal ${text}`
  );
};

export const waitForUrl = (url, timeout = TIMEOUT) => {
  browser.waitUntil(() => browser.getUrl() === url, timeout, `URL of window is not ${url}`);
};

export const waitForNewWindow = () => {
  browser.waitUntil(() => browser.getWindowHandles().length > 1);
};

export const switchToNewWindow = () => {
  const handles = browser.getWindowHandles();
  browser.switchToWindow(handles[1]);
};

export const camelCase = str =>
  str
    .replace(/\s(.)/g, a => a.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, b => b.toLowerCase());

export const clickElement = (page, elemName) => {
  waitForElement(page, elemName);
  page[elemName].click();
};

export const scrollBy = (posX, posY) => {
  browser.execute(
    (_posX, _posY) => {
      window.scrollBy(_posX, _posY);
    },
    posX,
    posY
  );
};

export const waitForTitle = (title, timeout = TIMEOUT) => {
  browser.waitUntil(() => browser.getTitle() === title, timeout, `Title of window is not ${title}`);
};

export const setValue = (page, elemName, value) => {
  waitForElement(page, elemName);
  page[elemName].setValue(value);
};

export const generateRandomString = length => {
  let result = 'X1';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
