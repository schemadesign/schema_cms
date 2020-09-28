import path from 'path';
import { camelize } from 'humps';
import { createSelectors, makeFileInputVisible } from '../../../helpers/utils';
import { waitForElement } from '../../../helpers/waitFor';
import { clickElement, setValue } from '../../../helpers/actions';
import { DEFAULT, PREDEFINED_SCRIPTS, SELECTED, UPLOADED, UPLOADED_SCRIPT_PATH } from './steps.constants';

const TIMEOUT = browser.config.waitforTimeout;

const singleSelectors = {
  stepCounter: '#stepCounter',
  fileUploadBtn: '[for="fileUpload"] > div',
  fileUploadInput: '#fileUpload',
  saveStepsBtn: '#saveStepsBtn',
  imageScrapingPreviewCode: '#imageScrapingPreviewCode',
  imageScrapingUrlFieldsHeader: '#imageScrapingUrlFieldsHeader',
  imageScrapingUrlFieldName: '#fieldCheckboxGroup span',
  imageScrapingBackBtn: '#imageScrapingBackBtn',
  selectedStepsHeader: '#selectedStepsHeader',
  deselectedStepsHeader: '#deselectedStepsHeader',
};

const multiSelectors = {
  scriptNames: '[id^="checkboxName"]',
  scriptTypes: '[id^="checkboxType"]',
  selectedScripts: '[id^="selectedScript"] [title]',
  deselectedScripts: '[id^="deselectedScript"] [title]',
};

const isDefScriptDisplayed = () => () =>
  PREDEFINED_SCRIPTS.forEach(item => expect($(`[id^="checkboxName-${camelize(item)}"]`)).toHaveText(item));

const getSelectedCheckbox = () => scriptName => $(`[for^="drag-checkbox-${camelize(scriptName)}"]`);

const getSelectedCheckboxIcon = () => scriptName => $(`[for^="drag-checkbox-${camelize(scriptName)}"] g`);

const getDeselectedCheckbox = () => scriptName => $(`[for^="checkbox-${camelize(scriptName)}"]`);

const getScriptByName = () => scriptName => $(`[id^="checkboxName-${camelize(scriptName)}"]`);

const getScriptCodePreview = () => scriptName => $(`#${camelize(scriptName)}PreviewCode`);

const isScriptOnTheList = Steps => (scriptName, listType) =>
  Steps[`${listType}Scripts`]().filter(script => script.getText() === scriptName).length > 0;

const isScriptSelected = () => scriptName => {
  if (getSelectedCheckbox()(scriptName).isExisting()) {
    const script = getSelectedCheckboxIcon()(scriptName);
    return script.getAttribute('fill-rule') === 'evenodd';
  }
  return false;
};

const selectScript = () => scriptName => {
  const deselectedScriptCheckbox = getDeselectedCheckbox()(scriptName);
  deselectedScriptCheckbox.scrollIntoView();
  deselectedScriptCheckbox.click();
};

const deselectScript = () => scriptName => {
  if (!isScriptSelected()(scriptName)) {
    selectScript()(scriptName);
  }
  const selectedScriptCheckbox = getSelectedCheckbox()(scriptName);
  selectedScriptCheckbox.scrollIntoView();
  clickElement(selectedScriptCheckbox);
};

const waitForScriptToBeSelected = () => (scriptName, timeout = TIMEOUT) =>
  browser.waitUntil(() => getSelectedCheckboxIcon()(scriptName).getAttribute('fill-rule') === 'evenodd', {
    timeout,
    timeoutMsg: `Script ${scriptName} still not selected after ${timeout} milliseconds`,
  });

const isNumberOfScriptsBigger = Steps => (scriptState, baseNumber) =>
  Steps[`${scriptState}Scripts`]().length > baseNumber;

const waitForNumberOfScriptsToChange = Steps => (scriptState, baseNumber, timeout = TIMEOUT) =>
  browser.waitUntil(() => isNumberOfScriptsBigger(Steps)(scriptState, baseNumber), {
    timeout,
    timeoutMsg: `Number of ${scriptState} scripts should be bigger than ${baseNumber}`,
  });

const calculateScriptsAmount = Steps => scriptState => Steps[`${scriptState}Scripts`]().length;

const waitForScriptsToRender = Steps => (timeout = TIMEOUT) =>
  browser.waitUntil(() => Steps.deselectedScripts().length > 0, {
    timeout,
    timeoutMsg: `Default scripts still not displayed after ${timeout} milliseconds`,
  });

const passScriptToInput = Steps => () => {
  const filePath = path.join(__dirname, UPLOADED_SCRIPT_PATH);
  setValue(Steps.fileUploadInput(), filePath);
};

const uploadScript = Steps => scriptName => {
  const numberOfSelectedScripts = calculateScriptsAmount(Steps)(SELECTED);
  Steps.fileUploadInput().waitForExist();
  makeFileInputVisible(Steps.fileUploadInput());
  waitForElement(Steps.fileUploadInput());
  passScriptToInput(Steps)();
  waitForNumberOfScriptsToChange(Steps)(SELECTED, numberOfSelectedScripts);
  waitForScriptToBeSelected()(scriptName);
  expect(isScriptSelected()(scriptName)).toBe(true);
};

const processDataSourceWithScript = Steps => (scriptType, scriptName) => {
  if (scriptType === UPLOADED) {
    uploadScript(Steps)(scriptName);
  }
  if (scriptType === DEFAULT) {
    selectScript(Steps)(scriptName);
  }
  Steps.saveStepsBtn().click();
};

const getFunctions = Steps => ({
  isDefScriptDisplayed: isDefScriptDisplayed(Steps),
  selectScript: selectScript(Steps),
  deselectScript: deselectScript(Steps),
  isScriptSelected: isScriptSelected(Steps),
  calculateScriptsAmount: calculateScriptsAmount(Steps),
  waitForScriptsToRender: waitForScriptsToRender(Steps),
  uploadScript: uploadScript(Steps),
  processDataSourceWithScript: processDataSourceWithScript(Steps),
  getSelectedCheckbox: getSelectedCheckbox(),
  getDeselectedCheckbox: getDeselectedCheckbox(),
  getSelectedCheckboxIcon: getSelectedCheckboxIcon(),
  getScriptByName: getScriptByName(),
  getScriptCodePreview: getScriptCodePreview(),
  isScriptOnTheList: isScriptOnTheList(Steps),
  waitForNumberOfScriptsToChange: waitForNumberOfScriptsToChange(Steps),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
