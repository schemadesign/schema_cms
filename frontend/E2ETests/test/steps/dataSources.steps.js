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
import PAGE_TITLE from '../pages/Constants/pageTitle.constants'
import { TAB_PAGE_TITLE } from '../pages/Components/Tabs/tabs.constants';
import { CREATE, CSV_FILE, PROCESS } from "../pages/DataSources/Create/createDatasource.constants";
import { DATA_SOURCE_PREVIEW_FIELDS_LABEL } from '../pages/DataSources/Preview/dataSourcePreview.constants';
import {
  BACKWARD_FILL_SCRIPT_NAME,
  IMAGE_SCRAPING_CODE,
  IMAGE_SCRAPING_URL_FIELD_HEADER,
  IMAGE_SCRAPING_URL_FIELD_NAME,
  SCRIPT_PREVIEW_PAGE_TITLE,
  SELECTED,
  SELECTED_STEPS_HEADER,
  STEPS_COUNTER_TEXT,
  UNSELECTED_STEPS_TEXT,
  UPLOADED_SCRIPT_NAME,
  UPLOADED_SCRIPT_TYPE,
  UPLOADED_STEPS_COUNTER_TEXT,
} from '../pages/DataSources/Steps/steps.constants';

When('I choose to see a list of data sources', () => {
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

Then('newly created data source is displayed on the list', () => {
  expect(TopHeader.projectName()).toHaveText(Homepage.tileTitle);
  DataSources.expectDataSourceTileToHaveProperData(CreateDataSource.datasetName);
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

When('I( have) navigate(d) to Steps page', () => {
  clickElement(SubHeader.stepsBtn());
  expect(browser).toHaveTitle(PAGE_TITLE.steps);
});

Then('I can see a list of predefined scripts', () => {
  Steps.isDefScriptDisplayed();
  expect(Steps.stepCounter()).toHaveText(STEPS_COUNTER_TEXT);
  expect(Steps.deselectedStepsHeader()).toHaveText(UNSELECTED_STEPS_TEXT);
});

When('I {word} a script', action => {
  Steps.waitForScriptsToRender();
  Steps.amountOfPredefinedScripts = Steps.calculateDeselectedScriptsAmount();
  Steps[`${action}Script`]();
  Steps.amountOfSelectedScripts = Steps.calculateSelectedScriptsAmount();
});

Then('script gets {word}', checkboxState =>
  checkboxState === SELECTED
    ? expect(Steps.isScriptSelected(checkboxState)).toBe(true)
    : expect(Steps.isScriptSelected(checkboxState)).toBe(false)
);

When('I chose to preview a script', () => {
  clickElement(Steps.imageScrapingScript());
  waitForTitle(SCRIPT_PREVIEW_PAGE_TITLE);
});

Then('I can see script code on preview page', () => {
  expect(
    Steps.imageScrapingPreviewCode()
      .getText()
      .trim()
  ).toEqual(IMAGE_SCRAPING_CODE);
});

When('I select an Image Scraping script', () => {
  clickElement(Steps.imageScrapingScriptCheckbox());
  waitForTitle(SCRIPT_PREVIEW_PAGE_TITLE);
});

Then('I can see columns with URL', () => {
  expect(Steps.imageScrapingUrlFieldsHeader()).toHaveText(IMAGE_SCRAPING_URL_FIELD_HEADER);
  expect(Steps.imageScrapingUrlFieldName()).toHaveText(IMAGE_SCRAPING_URL_FIELD_NAME);
});

Then(/^uploaded script is at the top of the list$/, () => {
  expect(Steps.selectedStepsHeader()).toHaveText(SELECTED_STEPS_HEADER);
  expect(Steps.firstSelectedScript()).toHaveText(UPLOADED_SCRIPT_NAME);
  expect(Steps.firstSelectedScriptType()).toHaveText(UPLOADED_SCRIPT_TYPE);
  expect(Steps.stepCounter()).toHaveText(UPLOADED_STEPS_COUNTER_TEXT);
});

Then('the script is moved to the list of selected scripts', () => {
  Steps.selectedCheckbox().waitForExist();
  expect(Steps.selectedStepsHeader()).toHaveText(SELECTED_STEPS_HEADER);
  expect(Steps.selectedScripts()).toBeElementsArrayOfSize({ eq: Steps.amountOfSelectedScripts });
  expect(Steps.selectedScriptCheckbox()).toBeExisting();
});

Then('the script is no longer on the default list', () => {
  expect(Steps.deselectedScripts()).toBeElementsArrayOfSize({
    eq: Steps.amountOfPredefinedScripts - Steps.calculateSelectedScriptsAmount(),
  });
  expect(Steps.deselectedScriptCheckbox()).not.toHaveText(BACKWARD_FILL_SCRIPT_NAME);
});

Given('I ch(o)ose to process data source with {word} script', scriptType => {
  Steps.processDataSourceWithScript(scriptType);
  DataSources.waitForDataSourceStatusToChange(PROCESS);
});

Then(/^data in table is (.*)$/, dataFormat => {
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
