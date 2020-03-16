import { Given, When, Then } from 'cucumber';
import { clickElement, waitForElement, waitForText, waitForTitle, scrollBy } from '../utils/utils';
import ProjectDetailsPage from '../pageobjects/projectDetails.page';
import DataSourcesPage from '../pageobjects/dataSources.page';
import CreateDataSourcePage from '../pageobjects/createDataSource.page';
import DataSourcePreviewPage from '../pageobjects/dataSourcePreview.page';
import StepsPage from '../pageobjects/steps.page';
import SubHeader from '../pageobjects/components/subHeader.component';
import {
  DATA_SOURCES_PAGE_TITLE,
  HEADER_SUBTITLE,
  HEADER_TITLE,
  SOURCE_LABEL,
  ITEMS_LABEL,
  FIELDS_LABEL,
  FILTERS_LABEL,
  VIEWS_LABEL,
  CREATOR_NAME,
} from '../constants/dataSourcesPage.constants';
import { TAB_PAGE_TITLE } from '../constants/config.constants';
import { CREATE, CSV_FILE, PROCESS, SUCCESS, VALID } from '../constants/createDatasource.constants';
import { DATA_SOURCE_PREVIEW_FIELDS_LABEL, DATA_SOURCE_PAGE_TITLE } from '../constants/dataSourcePreview.constants';

Given('I have entered Data Sources page', () => {
  clickElement(ProjectDetailsPage, 'dataSourcesTile');
  waitForElement(DataSourcesPage, 'createDataSourceBtn');

  expect(browser.getTitle()).to.equal(DATA_SOURCES_PAGE_TITLE);
});

When('I choose to see list of data sources', () => {
  clickElement(ProjectDetailsPage, 'dataSourcesTile');
});

Then('I am on Data Sources page', () => {
  waitForElement(DataSourcesPage, 'createDataSourceBtn');

  expect(browser.getTitle()).to.equal(DATA_SOURCES_PAGE_TITLE);
});

Then('Title of the page is displayed', () => {
  waitForElement(DataSourcesPage, 'title');

  expect(DataSourcesPage.title.getText()).to.equal(HEADER_TITLE);
});

Then(/^I can see Data Sources page with all its elements$/, function() {
  waitForElement(DataSourcesPage, 'title');
  waitForElement(DataSourcesPage, 'subtitle');
  waitForElement(DataSourcesPage, 'createDataSourceBtn');
  waitForElement(DataSourcesPage, 'creationDate');
  waitForElement(DataSourcesPage, 'dataSourceCreator');
  waitForElement(DataSourcesPage, 'sourceLabel');
  waitForElement(DataSourcesPage, 'sourceIcon');
  waitForElement(DataSourcesPage, 'itemsLabel');
  waitForElement(DataSourcesPage, 'itemsValue');
  waitForElement(DataSourcesPage, 'fieldsLabel');
  waitForElement(DataSourcesPage, 'fieldsValue');
  waitForElement(DataSourcesPage, 'filtersLabel');
  waitForElement(DataSourcesPage, 'filtersValue');
  waitForElement(DataSourcesPage, 'viewsLabel');
  waitForElement(DataSourcesPage, 'viewsValue');

  expect(DataSourcesPage.title.getText()).to.equal(HEADER_TITLE);
  expect(DataSourcesPage.subtitle.getText()).to.equal(HEADER_SUBTITLE);
  expect(DataSourcesPage.viewsLabel.getText()).to.equal(VIEWS_LABEL);
  expect(DataSourcesPage.viewsValue.getText()).to.equal('—');
  expect(DataSourcesPage.filtersLabel.getText()).to.equal(FILTERS_LABEL);
  expect(DataSourcesPage.fieldsLabel.getText()).to.equal(FIELDS_LABEL);
  expect(DataSourcesPage.fieldsValue.getText()).to.not.be.null;
  expect(DataSourcesPage.itemsLabel.getText()).to.equal(ITEMS_LABEL);
  expect(DataSourcesPage.itemsValue.getText()).to.not.be.null;
  expect(DataSourcesPage.sourceLabel.getText()).to.equal(SOURCE_LABEL);
  expect(DataSourcesPage.dataSourceCreator.getText()).to.not.be.null;
  expect(DataSourcesPage.creationDate.getText()).to.not.be.null;
  assert(DataSourcesPage.createDataSourceBtn.isDisplayed(), 'Create data source button is not displayed');
  assert(DataSourcesPage.sourceIcon.isDisplayed(), 'Source icon is not displayed');
});

Given(/^I have entered (settings|sources|pages|states|users) tab$/, function(tabName) {
  clickElement(ProjectDetailsPage.Tabs, `${tabName}`);

  expect(browser.getTitle()).to.equal(TAB_PAGE_TITLE[tabName]);
});

When('I cho(o)se to upload a valid CSV file', function() {
  clickElement(DataSourcesPage, 'createDataSourceBtn');
  CreateDataSourcePage.uploadCsvFile(VALID);
});

Then(/^newly created data source is displayed on list$/, function() {
  waitForTitle(DATA_SOURCES_PAGE_TITLE);
  waitForElement(DataSourcesPage, 'dataSourceTitle');

  waitForText(DataSourcesPage, 'itemsValue', CSV_FILE.rowsAmount);
  waitForText(DataSourcesPage, 'fieldsValue', CSV_FILE.columnsAmount);
  waitForText(DataSourcesPage, 'dataSourceCreator', CREATOR_NAME);

  expect(DataSourcesPage.dataSourceTitle.getText()).to.equal(CreateDataSourcePage.projectName);
  expect(DataSourcesPage.itemsValue.getText()).to.equal(CSV_FILE.rowsAmount);
  expect(DataSourcesPage.fieldsValue.getText()).to.equal(CSV_FILE.columnsAmount);
  expect(DataSourcesPage.dataSourceCreator.getText()).to.equal(CREATOR_NAME);
});

When('I cho(o)se to see data source preview', function() {
  clickElement(DataSourcesPage, 'dataSourceTitle');
});

Then('I am on data source {word} page', function(pageType) {
  waitForTitle(DATA_SOURCE_PAGE_TITLE[pageType]);
  waitForElement(DataSourcePreviewPage.SubHeader, 'title');
  expect(DataSourcePreviewPage.SubHeader.title.getText()).to.equal(CreateDataSourcePage.projectName);
});

Then(/^data in preview table matches data from CSV file$/, function() {
  waitForElement(DataSourcePreviewPage, 'fieldsAmount');

  expect(DataSourcePreviewPage.fieldsAmount.getText()).to.equal(DATA_SOURCE_PREVIEW_FIELDS_LABEL);

  DataSourcePreviewPage.waitForPreviewTableToRender();

  expect(DataSourcePreviewPage.calculateAmountOfColumns()).to.equal(parseInt(CSV_FILE.columnsAmount));
  expect(DataSourcePreviewPage.calculateAmountOfRows()).to.equal(parseInt(CSV_FILE.displayedRowsAmount));
  DataSourcePreviewPage.expectPreviewTableToMatchFile();
});

Then(/^I can see status of file updating on the tile$/, function() {
  DataSourcesPage.waitForDataSourceStatusToChange(CREATE);
});

When('I cho(o)se to see field info preview', function() {
  clickElement(DataSourcePreviewPage, 'rightArrowBtn');
});

Then(/^data in field preview table matches data from CSV file$/, function() {
  DataSourcePreviewPage.expectFieldInfoToMatchFile();
});

When('I( have) navigate(d) to Steps page', function() {
  clickElement(SubHeader, 'stepsBtn');

  expect(browser.getTitle()).to.equal(StepsPage.PAGE_TITLE);
});

Then(/^I can see a list of predefined scripts$/, function() {
  StepsPage.isDefScriptDisplayed();
  expect(StepsPage.stepCounter().getText()).to.equal(StepsPage.STEPS_COUNTER_TEXT);
  expect(StepsPage.deselectedStepsHeader().getText()).to.equal(StepsPage.UNSELECTED_STEPS_TEXT);
});

When('I {word} a script', function(action) {
  StepsPage.waitForScriptsToRender();
  StepsPage.amountOfPredefinedScripts = StepsPage.calculateDeselectedScriptsAmount();
  StepsPage[`${action}Script`]();
  StepsPage.amountOfSelectedScripts = StepsPage.calculateSelectedScriptsAmount();
});

Then('script gets {word}', function(checkboxState) {
  checkboxState === StepsPage.SELECTED
    ? expect(StepsPage.isScriptSelected(checkboxState)).to.be.true
    : expect(StepsPage.isScriptSelected(checkboxState)).to.be.false;
});

When(/^I chose to preview a script$/, function() {
  StepsPage.imageScrapingScript().click();
  waitForTitle(StepsPage.SCRIPT_PREVIEW_PAGE_TITLE);
});

Then(/^I can see script code on preview page$/, function() {
  StepsPage.imageScrapingPreviewCode().waitForDisplayed();

  expect(StepsPage.imageScrapingPreviewCode().getText()).to.equal(StepsPage.IMAGE_SCRAPING_CODE);
});

When(/^I select an Image Scraping script$/, function() {
  StepsPage.imageScrapingScriptCheckbox().click();
  waitForTitle(StepsPage.SCRIPT_PREVIEW_PAGE_TITLE);
});

Then(/^I can see columns with URL$/, function() {
  StepsPage.imageScrapingUrlFieldsHeader().waitForDisplayed();
  StepsPage.imageScrapingUrlFieldName().waitForDisplayed();

  expect(StepsPage.imageScrapingUrlFieldsHeader().getText()).to.equal(StepsPage.IMAGE_SCRAPING_URL_FIELD_HEADER);
  expect(StepsPage.imageScrapingUrlFieldName().getText()).to.equal(StepsPage.IMAGE_SCRAPING_URL_FIELD_NAME);
});

Then(/^uploaded script is at the top of the list$/, function() {
  StepsPage.selectedStepsHeader().waitForDisplayed();
  StepsPage.firstSelectedScript().waitForDisplayed();
  StepsPage.firstSelectedScriptType().waitForDisplayed();
  StepsPage.stepCounter().waitForDisplayed();

  expect(StepsPage.selectedStepsHeader().getText()).to.equal(StepsPage.SELECTED_STEPS_HEADER);
  expect(StepsPage.firstSelectedScript().getText()).to.equal(StepsPage.UPLOADED_SCRIPT_NAME);
  expect(StepsPage.firstSelectedScriptType().getText()).to.equal(StepsPage.UPLOADED_SCRIPT_TYPE);
  expect(StepsPage.stepCounter().getText()).to.equal(StepsPage.UPLOADED_STEPS_COUNTER_TEXT);
});

Then(/^the script is moved to the list of selected scripts$/, function() {
  StepsPage.selectedStepsHeader().waitForDisplayed();
  StepsPage.selectedCheckbox().waitForExist();

  expect(StepsPage.selectedStepsHeader().getText()).to.equal(StepsPage.SELECTED_STEPS_HEADER);
  expect(StepsPage.calculateSelectedScriptsAmount()).to.equal(StepsPage.amountOfSelectedScripts);
  assert(
    StepsPage.selectedScriptCheckbox().isExisting(),
    `Script ${StepsPage.selectedScriptCheckbox()} is not selected`
  );
});

Then(/^the script is no longer on the default list$/, function() {
  expect(StepsPage.calculateDeselectedScriptsAmount()).to.equal(
    StepsPage.amountOfPredefinedScripts - StepsPage.calculateSelectedScriptsAmount()
  );
  expect(StepsPage.deselectedScriptCheckbox().getText()).to.not.equal(StepsPage.BACKWARD_FILL_SCRIPT_NAME);
});

Given('I ch(o)ose to process data source with {word} script', function(scriptType) {
  StepsPage.processDataSourceWithScript(scriptType);
  StepsPage.saveStepsBtn().click();
  DataSourcesPage.waitForDataSourceStatusToChange(PROCESS);
});

Then(/^data in table is (.*)$/, function(dataFormat) {
  waitForElement(DataSourcePreviewPage, 'fieldsAmount');
  expect(DataSourcePreviewPage.fieldsAmount.getText()).to.equal(DATA_SOURCE_PREVIEW_FIELDS_LABEL);
  DataSourcePreviewPage.waitForPreviewTableToRender();
  expect(DataSourcePreviewPage.calculateAmountOfColumns()).to.equal(parseInt(CSV_FILE.columnsAmount));
  expect(DataSourcePreviewPage.calculateAmountOfRows()).to.equal(parseInt(CSV_FILE.displayedRowsAmount));
  DataSourcePreviewPage.expectPreviewTableToBeCased(dataFormat);
});
