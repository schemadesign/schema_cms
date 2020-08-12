import path from 'path';
import { createSelectors, makeFileInputVisible } from '../../../helpers/utils';
import { waitForElement, waitForTitle } from '../../../helpers/waitFor';
import { clickElement, setValue } from "../../../helpers/actions";
import PAGE_TITLE from '../../Constants/pageTitle.constants'
import {
  DEFAULT,
  DESELECTED,
  PREDEFINED_SCRIPTS,
  SELECTED,
  UPLOADED,
  UPLOADED_SCRIPT_PATH,
} from './steps.constants';

const singleSelectors = {
  stepCounter: '#stepCounter',
  fileUploadBtn: '[for="fileUpload"] > div',
  fileUploadInput: '#fileUpload',
  saveStepsBtn: '#saveStepsBtn',
  selectedScriptCheckbox: '[for="drag-checkbox-0"]',
  selectedCheckbox: '[for="drag-checkbox-0"] g',
  deselectedScriptCheckbox: '[for="checkbox-10"]',
  deselectedCheckbox: '[for="checkbox-1"] path',
  imageScrapingScriptCheckbox: '[for="checkbox-0"]',
  imageScrapingScript: '#checkboxName-0',
  imageScrapingPreviewCode: '#imageScrapingPreviewCode',
  imageScrapingUrlFieldsHeader: '#imageScrapingUrlFieldsHeader',
  imageScrapingUrlFieldName: '#fieldCheckboxGroup span',
  selectedStepsHeader: '#selectedStepsHeader',
  deselectedStepsHeader: '#deselectedStepsHeader',
  firstSelectedScript: '#selectedScript-0 #checkboxName-0',
  firstSelectedScriptType: '#selectedScript-0 #checkboxType-0',
};

const multiSelectors = {
  scriptNames: '[id^="checkboxName"]',
  scriptTypes: '[id^="checkboxType"]',
  selectedScripts: '[id^="selectedScript"]',
  deselectedScripts: '[id^="deselectedScript"]',
};

const isDefScriptDisplayed = Steps => () => {
  PREDEFINED_SCRIPTS.forEach((item, index) => {
    waitForElement($(`#checkboxName-${index}`));
    expect(Steps.scriptNames()[index]).toHaveText(item);
  });
};

const isScriptSelected = Steps => (checkboxState = SELECTED) =>
  Steps[`${checkboxState}Checkbox`]().getAttribute('fill-rule') === 'evenodd';

const selectScript = Steps => () => {
  Steps.deselectedScriptCheckbox().scrollIntoView();
  clickElement(Steps.deselectedScriptCheckbox());
};

const deselectScript = Steps => () => {
  if (!isScriptSelected(Steps)(DESELECTED)) {
    selectScript(Steps)();
  }
  clickElement(Steps.selectedScriptCheckbox());
};

const calculateSelectedScriptsAmount = Steps => () => Steps.selectedScripts().length;

const calculateDeselectedScriptsAmount = Steps => () => Steps.deselectedScripts().length;

const waitForScriptsToRender = Steps => () => {
  browser.waitUntil(() => Steps.deselectedScripts().length > 0);
};

const passScriptToInput = Steps => () => {
  const filePath = path.join(__dirname, UPLOADED_SCRIPT_PATH);
  setValue(Steps.fileUploadInput(), filePath);
};

const uploadScript = Steps => () => {
  waitForTitle(PAGE_TITLE.steps);
  Steps.fileUploadInput().waitForExist();
  makeFileInputVisible(Steps.fileUploadInput());
  waitForElement(Steps.fileUploadInput());
  passScriptToInput(Steps)();
  waitForElement(Steps.firstSelectedScript());
};

const processDataSourceWithScript = Steps => scriptType => {
  if (scriptType === UPLOADED) {
    uploadScript(Steps)();
  }
  if (scriptType === DEFAULT) {
    selectScript(Steps)();
  }
  Steps.saveStepsBtn().click();
};

const getFunctions = Steps => ({
  isDefScriptDisplayed: isDefScriptDisplayed(Steps),
  selectScript: selectScript(Steps),
  deselectScript: deselectScript(Steps),
  isScriptSelected: isScriptSelected(Steps),
  calculateSelectedScriptsAmount: calculateSelectedScriptsAmount(Steps),
  calculateDeselectedScriptsAmount: calculateDeselectedScriptsAmount(Steps),
  waitForScriptsToRender: waitForScriptsToRender(Steps),
  uploadScript: uploadScript(Steps),
  processDataSourceWithScript: processDataSourceWithScript(Steps),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
