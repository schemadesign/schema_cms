import PAGE_URL from '../pages/Constants/pageURL.constants';
import PAGE_TITLE from '../pages/Constants/pageTitle.constants';
import { waitForTitle, waitForUrl } from './waitFor';
import { convertToCamelCase } from './utils';

export const expectToBeDisplayed = obj => {
  Object.keys(obj).forEach(key => expect(obj[key]()).toBeDisplayed());
};

export const expectElemsToHaveText = (obj, labelsArr) =>
  Object.keys(obj).forEach((key, index) => {
    if (obj[key]().getText() === undefined || obj[key]().getText() === '') {
      return expect(obj[key]()).toHaveValue(labelsArr[index]);
    }
    return expect(obj[key]()).toHaveText(labelsArr[index]);
  });

export const expectElemsToHaveAttribute = (obj, attributesArr, valueArr) =>
  Object.keys(obj).forEach((key, index) => expect(obj[key]()).toHaveAttribute(attributesArr[index], valueArr[index]));

export const expectElemsNotToBeEmpty = obj =>
  Object.keys(obj).forEach(key => {
    if (obj[key]().getValue() !== undefined) {
      return expect(obj[key]()).not.toHaveValue('');
    }
    return expect(obj[key]()).not.toHaveText('');
  });

export const expectPageToHaveTitle = pageName => {
  waitForTitle(PAGE_TITLE[convertToCamelCase(pageName)]);
  expect(browser).toHaveTitle(PAGE_TITLE[convertToCamelCase(pageName)]);
};

export const expectPageToHaveUrl = pageName => {
  waitForUrl(PAGE_URL[convertToCamelCase(pageName)]);
  expect(browser.getUrl()).toMatch(PAGE_URL[convertToCamelCase(pageName)]);
};
