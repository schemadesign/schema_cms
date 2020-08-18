import { waitForElement } from './waitFor';

export const isTextDisplayed = (selector, text, index) => {
  waitForElement(selector, index);
  expect(selector).toHaveText(text);
  return true;
};
