import { waitForElementsToLoad } from './waitFor';

export const switchToNewWindow = () => {
  const handles = browser.getWindowHandles();
  browser.switchToWindow(handles[1]);
};

const clickSingleElement = selector => {
  selector.waitForExist();
  selector.waitForDisplayed();
  selector.click();
};

const clickMultiElement = (selector, index) => {
  selector[index].waitForExist();
  selector[index].waitForDisplayed();
  selector[index].click();
};

export const clickElement = (selector, index) => {
  if (index !== undefined) {
    waitForElementsToLoad(selector, index);
    return clickMultiElement(selector, index);
  }
  return clickSingleElement(selector);
};

const setValueForSingleElement = (selector, value) => {
  selector.waitForDisplayed();
  selector.clearValue();
  selector.setValue(value);
};

const setValueForMultiElement = (selector, value, index) => {
  selector[index].waitForDisplayed();
  selector[index].clearValue();
  selector[index].setValue(value);
};

export const setValue = (selector, value, index) => {
  if (index !== undefined) {
    waitForElementsToLoad(selector, index);
    return setValueForMultiElement(selector, value, index);
  }
  return setValueForSingleElement(selector, value);
};
