import { pascalize } from 'humps';
import { Given, When, Then } from 'cucumber';
import ProjectSettings from '../pages/ProjectSettings/projectSettings.page';
import DataSources from '../pages/DataSources/DataSource/dataSource.page';
import CreateDataSource from '../pages/DataSources/Create/createDataSource.page';
import DataSourcePreview from '../pages/DataSources/Preview/dataSourcePreview.page';
import Homepage from '../pages/Homepage/homepage.page';
import Steps from '../pages/DataSources/Steps/steps.page';
import SubHeader from '../pages/Components/SubHeader/subHeader.component';
import TopHeader from '../pages/Components/TopHeader/topHeader.component';
import Tabs from '../pages/Components/Tabs/tabs.component';
import { generateRandomString } from '../helpers/utils';
import { clickElement } from '../helpers/actions';
import { waitForTitle } from '../helpers/waitFor';
import { TAB_PAGE_TITLE } from '../pages/Components/Tabs/tabs.constants';
import { CREATE, CSV_FILE, PROCESS } from '../pages/DataSources/Create/createDatasource.constants';
import { DATA_SOURCE_PREVIEW_FIELDS_LABEL } from '../pages/DataSources/Preview/dataSourcePreview.constants';
import {
  DESELECTED,
  IMAGE_SCRAPING_CODE,
  IMAGE_SCRAPING_URL_FIELD_HEADER,
  IMAGE_SCRAPING_URL_FIELD_NAME,
  SCRIPT_PREVIEW_PAGE_TITLE,
  SELECTED,
  STEPS_COUNTER_TEXT,
  UNSELECTED_STEPS_TEXT,
} from '../pages/DataSources/Steps/steps.constants';
import { expectPageToHaveTitle, expectPageToHaveUrl } from '../helpers/expect';

When('I cho(o)se to see a list of data sources', () => {
  ProjectSettings.dataSourcesAmount = ProjectSettings.dataSourcesTileValue().getText();
  clickElement(ProjectSettings.dataSourcesTile());
});

Given('I have entered {string} tab', tabName => {
  clickElement(Tabs[`${tabName}`]());
  expect(browser).toHaveTitle(TAB_PAGE_TITLE[tabName]);
});

When('I cho(o)se to upload a {string} CSV file', fileState => {
  CreateDataSource.datasetName = `DataSource ${generateRandomString(8)}`;
  clickElement(DataSources.createDataSourceBtn());
  CreateDataSource.uploadCsvFile(CreateDataSource.datasetName, fileState);
});

Then('data source created by {string} is displayed on the list', userRole => {
  expect(TopHeader.projectName()).toHaveText(Homepage.tileTitle);
  DataSources.expectDataSourceTileToHaveProperData(CreateDataSource.datasetName, userRole);
  browser.refresh();
});

When('I cho(o)se to see data source preview', () => {
  browser.refresh();
  clickElement(DataSources.title());
});

Then('subheader for {string} page is displayed', pageName => {
  SubHeader.isDataSourceSubHeaderDisplayed(CreateDataSource.datasetName, pageName);
});

Then('data in preview table matches data from CSV file', () => {
  expect(DataSourcePreview.fieldsAmount()).toHaveText(DATA_SOURCE_PREVIEW_FIELDS_LABEL);
  DataSourcePreview.waitForPreviewTableToRender();
  expect(DataSourcePreview.columns()).toBeElementsArrayOfSize({
    eq: parseInt(CSV_FILE.displayedColumnsAmount, 10),
  });
  expect(DataSourcePreview.rows()).toBeElementsArrayOfSize({ eq: parseInt(CSV_FILE.displayedRowsAmount, 10) });
  DataSourcePreview.expectPreviewTableToMatchFile();
});

Then('I can see status of file updating on the tile', () => {
  DataSources.waitForDataSourceStatusToChange(CREATE);
});

When('I cho(o)se to see field info preview', () => {
  clickElement(DataSourcePreview.rightArrowBtn());
});

Then('data in field preview table matches data from CSV file', () => {
  DataSourcePreview.expectFieldInfoToMatchFile();
});

When('I( have) navigate(d) to {string} page', pageName => {
  SubHeader.navigateToPage(pageName);
  expectPageToHaveTitle(pageName);
  expectPageToHaveUrl(pageName);
});

Then('I can see a list of predefined scripts', () => {
  Steps.isDefScriptDisplayed();
  expect(Steps.stepCounter()).toHaveText(STEPS_COUNTER_TEXT);
  expect(Steps.deselectedStepsHeader()).toHaveText(UNSELECTED_STEPS_TEXT);
});

When('I {string} a(n) {string} script', (action, scriptName) => {
  Steps.waitForScriptsToRender();
  Steps.amountOfSelectedScripts = Steps.calculateScriptsAmount(SELECTED);
  Steps.amountOfDeselectedScripts = Steps.calculateScriptsAmount(DESELECTED);
  Steps[`${action}Script`](scriptName);
});

Then('{string} script is {string}', (scriptName, checkboxState) =>
  checkboxState === SELECTED
    ? expect(Steps.isScriptSelected(scriptName)).toBe(true)
    : expect(Steps.isScriptSelected(scriptName)).toBe(false)
);

When('I chose to preview a(n) {string} script', scriptName => {
  clickElement(Steps.getScriptByName(scriptName));
  waitForTitle(SCRIPT_PREVIEW_PAGE_TITLE);
});

Then('I can see {string} script code on preview page', scriptName => {
  expect(
    Steps.getScriptCodePreview(scriptName)
      .getText()
      .trim()
  ).toEqual(IMAGE_SCRAPING_CODE);
});

Then('I can see columns with URL', () => {
  expect(Steps.imageScrapingUrlFieldsHeader()).toHaveText(IMAGE_SCRAPING_URL_FIELD_HEADER);
  expect(Steps.imageScrapingUrlFieldName()).toHaveText(IMAGE_SCRAPING_URL_FIELD_NAME);
  clickElement(Steps.imageScrapingBackBtn());
});

Then('the {string} script is moved to the list of {string} scripts', (scriptName, listType) => {
  Steps[`get${pascalize(listType)}Checkbox`](scriptName).waitForExist();
  Steps.waitForNumberOfScriptsToChange(listType, Steps[`amountOf${pascalize(listType)}Scripts`]);
  Steps.amountOfSelectedScripts = Steps.calculateScriptsAmount(SELECTED);
  Steps.amountOfDeselectedScripts = Steps.calculateScriptsAmount(DESELECTED);
  expect(Steps[`${listType}Scripts`]()).toBeElementsArrayOfSize({ eq: Steps[`amountOf${pascalize(listType)}Scripts`] });
});

Then('the {string} script is no longer on the list of {string} scripts', (scriptName, listType) => {
  expect(Steps[`${listType}Scripts`]()).toBeElementsArrayOfSize({
    eq: Steps[`amountOf${pascalize(listType)}Scripts`],
  });
  expect(Steps.isScriptOnTheList(scriptName, listType)).toBe(false);
});

Given('I ch(o)ose to process data source with {string} {string} script', (scriptType, scriptName) => {
  Steps.processDataSourceWithScript(scriptType, scriptName);
  DataSources.waitForDataSourceStatusToChange(PROCESS);
});

Then('data in table is {string}', dataFormat => {
  expect(DataSourcePreview.fieldsAmount()).toHaveText(DATA_SOURCE_PREVIEW_FIELDS_LABEL);
  DataSourcePreview.waitForPreviewTableToRender();
  expect(DataSourcePreview.columns()).toBeElementsArrayOfSize({
    eq: parseInt(CSV_FILE.displayedColumnsAmount, 10),
  });
  expect(DataSourcePreview.rows()).toBeElementsArrayOfSize({
    eq: parseInt(CSV_FILE.displayedRowsAmount, 10),
  });
  DataSourcePreview.expectPreviewTableToBeCased(dataFormat);
});

Then('the number of data sources is equal to the number on Datasources tile', () => {
  const dataSources = DataSources.dataSourceContainers();
  expect(dataSources).toBeElementsArrayOfSize({ eq: parseInt(ProjectSettings.dataSourcesAmount, 10) });
});

When('I choose to upload a custom script', () => {
  Steps.uploadScript();
});
