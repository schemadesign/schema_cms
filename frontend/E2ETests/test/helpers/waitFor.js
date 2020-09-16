const TIMEOUT = browser.config.waitforTimeout;

export const waitForElementsToLoad = (selector, index = 0, timeout = TIMEOUT) =>
  browser.waitUntil(() => selector.length > index, {
    timeout,
    timeoutMsg: `The array of elements should be bigger than ${index}`,
  });

export const waitForElement = (selector, index) => {
  if (index !== undefined) {
    waitForElementsToLoad(selector, index);
    selector[index].waitForDisplayed();
  }
  selector.waitForDisplayed();
};

export const waitForText = (selector, text, index, timeout = TIMEOUT) => {
  if (index !== undefined) {
    waitForElementsToLoad(selector, index);
    if (selector[index].getText() === undefined || selector[index].getText() === '') {
      return browser.waitUntil(() => selector[index].getValue().trim() === text, {
        timeout,
        timeoutMsg: `Received text: ${selector[index].getValue().trim()} .\n Expected text: ${text}`,
      });
    }
    return browser.waitUntil(() => selector[index].getText().trim() === text, {
      timeout,
      timeoutMsg: `Received text: ${selector[index].getText().trim()} .\n Expected text: ${text}`,
    });
  }
  if (selector.getText() === undefined || selector.getText() === '') {
    return browser.waitUntil(() => selector.getValue().trim() === text, {
      timeout,
      timeoutMsg: `Received text: ${selector.getValue().trim()} .\n Expected text: ${text}`,
    });
  }
  return browser.waitUntil(() => selector.getText().trim() === text, {
    timeout,
    timeoutMsg: `Received text: ${selector.getText().trim()} .\n Expected text: ${text}`,
  });
};

export const waitForTitle = (title, timeout = TIMEOUT) => {
  browser.waitUntil(() => browser.getTitle() === title, {
    timeout,
    timeoutMsg: `Received title: ${browser.getTitle()}.\n Expected title: ${title}`,
  });
};

export const waitForUrl = (url, timeout = TIMEOUT) => {
  if (url instanceof RegExp) {
    return browser.waitUntil(
      () => {
        const pageUrl = browser.getUrl();
        return url.test(pageUrl);
      },
      {
        timeout,
        timeoutMsg: `Received URL: ${browser.getUrl()} Expected URL: ${url}`,
      }
    );
  }
  return browser.waitUntil(() => browser.getUrl() === url, {
    timeout,
    timeoutMsg: `Received URL: ${browser.getUrl()} Expected URL: ${url}`,
  });
};

export const waitForNewWindow = (timeout = TIMEOUT) => {
  browser.waitUntil(() => browser.getWindowHandles().length > 1, {
    timeout,
    timeoutMsg: `New window not existing after ${timeout} milliseconds`,
  });
};

export const waitForNotDisplayed = (selector, timeout = TIMEOUT) => {
  browser.waitUntil(() => !selector.isDisplayed(), { timeout, timeoutMsg: `${selector} is still displayed` });
};
