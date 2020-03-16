import path from 'path';
import { createSelectors, makeFileInputVisible, waitForElement, waitForTitle } from '../utils/utils';

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
  imageScrapingPreviewCode: '#imageScrapingPreviewCode > code',
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

const isDefScriptDisplayed = StepsPage => () => {
  StepsPage.PREDEFINED_SCRIPTS.forEach((item, index) => {
    $(`#checkboxName-${index}`).waitForDisplayed();
    expect(StepsPage.scriptNames()[index].getText()).to.equal(item);
  });
};

const isScriptSelected = StepsPage => (checkboxState = StepsPage.SELECTED) =>
  StepsPage[`${checkboxState}Checkbox`]().getAttribute('fill-rule') === 'evenodd';

const selectScript = StepsPage => () => {
  StepsPage.deselectedScriptCheckbox().scrollIntoView();
  StepsPage.deselectedScriptCheckbox().click();
};

const deselectScript = StepsPage => () => {
  if (!isScriptSelected(StepsPage)('deselected')) {
    selectScript(StepsPage)();
  }
  StepsPage.selectedScriptCheckbox().click();
};

const calculateSelectedScriptsAmount = StepsPage => () => StepsPage.selectedScripts().length;

const calculateDeselectedScriptsAmount = StepsPage => () => StepsPage.deselectedScripts().length;

const waitForScriptsToRender = StepsPage => () => {
  browser.waitUntil(() => StepsPage.deselectedScripts().length > 0);
};

const passScriptToInput = StepsPage => () => {
  const filePath = path.join(__dirname, StepsPage.UPLOADED_SCRIPT_PATH);
  StepsPage.fileUploadInput().setValue(filePath);
};

const uploadScript = StepsPage => () => {
  waitForTitle(StepsPage.PAGE_TITLE);
  StepsPage.fileUploadInput().waitForExist();
  makeFileInputVisible(StepsPage.fileUploadInput());
  StepsPage.fileUploadInput().waitForDisplayed();
  passScriptToInput(StepsPage)();
  StepsPage.firstSelectedScript().waitForDisplayed();
};

const processDataSourceWithScript = StepsPage => scriptType =>
  scriptType === 'uploaded' ? uploadScript(StepsPage)() : selectScript(StepsPage)();

const getFunctions = StepsPage => ({
  isDefScriptDisplayed: isDefScriptDisplayed(StepsPage),
  selectScript: selectScript(StepsPage),
  deselectScript: deselectScript(StepsPage),
  isScriptSelected: isScriptSelected(StepsPage),
  calculateSelectedScriptsAmount: calculateSelectedScriptsAmount(StepsPage),
  calculateDeselectedScriptsAmount: calculateDeselectedScriptsAmount(StepsPage),
  waitForScriptsToRender: waitForScriptsToRender(StepsPage),
  uploadScript: uploadScript(StepsPage),
  processDataSourceWithScript: processDataSourceWithScript(StepsPage),
});

const constants = {
  PAGE_TITLE: 'Data Wrangling - Schema CMS',
  SCRIPT_PREVIEW_PAGE_TITLE: 'View step - Schema CMS',
  STEPS_COUNTER_TEXT: '16 Steps',
  UPLOADED_STEPS_COUNTER_TEXT: '17 Steps',
  UNSELECTED_STEPS_TEXT: 'Steps',
  SELECTED: 'selected',
  IMAGE_SCRAPING_CODE: 'image_scraping(df, current_step=current_step)',
  IMAGE_SCRAPING_URL_FIELD_HEADER: 'Fields with URLs',
  IMAGE_SCRAPING_URL_FIELD_NAME: 'url',
  SELECTED_STEPS_HEADER: 'Selected steps',
  DESELECTED_STEPS_HEADER: 'Steps',
  BACKWARD_FILL_SCRIPT_NAME: 'Backward Fill',
  UPLOADED_SCRIPT_PATH: '../files/uppercase.py',
  UPLOADED_SCRIPT_NAME: 'uppercase',
  UPLOADED_SCRIPT_TYPE: 'Custom',
  PREDEFINED_SCRIPTS: [
    'Image Scraping',
    'Backward Fill',
    'Capitalize',
    'Change Nan To 0',
    'Drop Duplicates',
    'Drop Nan',
    'Empty Columns',
    'Empty Rows',
    'Forward Fill',
    'Last 5 Rows',
    'Lowercase',
    'Partly Empty Columns',
    'Partly Empty Rows',
    'Remove Whitespace',
    'Titlecase',
    'Uppercase',
  ],
};

const convertedSelectors = createSelectors({
  rest: { ...constants },
  singleSelectors,
  multiSelectors,
});

export default { ...convertedSelectors, ...getFunctions(convertedSelectors) };
