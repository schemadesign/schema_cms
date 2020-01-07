import { Given, When, Then } from 'cucumber';
import { clickElement, waitForElement } from '../utils/utils';
import ProjectDetailsPage from '../pageobjects/projectDetails.page';
import DataSourcesPage from '../pageobjects/dataSources.page';
import {
  DATA_SOURCES_PAGE_TITLE,
  HEADER_SUBTITLE,
  HEADER_TITLE,
  SOURCE_LABEL,
  ITEMS_LABEL,
  FIELDS_LABEL,
  FILTERS_LABEL,
  VIEWS_LABEL
} from '../constants/dataSourcesPage.constants';

Given('I have entered Data Sources page', () => {
  clickElement(ProjectDetailsPage, 'dataSourcesTile');
  waitForElement(DataSourcesPage, 'createDataSourceBtn');

  expect(browser.getTitle()).to.equal(DATA_SOURCES_PAGE_TITLE);
});

When('I choose to see list of data sources', () => {
  clickElement(ProjectDetailsPage, 'dataSourcesTile');
});

When('I choose to navigate back to the Projects page', () => {
  clickElement(DataSourcesPage, 'backBtn');
});

Then('I am on Data Sources page', () => {
  waitForElement(DataSourcesPage, 'createDataSourceBtn');

  expect(browser.getTitle()).to.equal(DATA_SOURCES_PAGE_TITLE);
});

Then('Title of the page is displayed', () => {
  waitForElement(DataSourcesPage, 'title');

  expect(DataSourcesPage.title.getText()).to.equal(HEADER_TITLE);
});

Then('date of creation is displayed', () => {
  waitForElement(DataSourcesPage, 'creationDate');

  expect(DataSourcesPage.creationDate.getText()).to.not.be.null;
});

Then('name of creator is displayed', () => {
  waitForElement(DataSourcesPage, 'dataSourceCreator');

  expect(DataSourcesPage.dataSourceCreator.getText()).to.not.be.null;
});

Then('source of the dataset is displayed', () => {
  waitForElement(DataSourcesPage, 'sourceLabel');
  waitForElement(DataSourcesPage, 'sourceIcon');

  expect(DataSourcesPage.sourceLabel.getText()).to.equal(SOURCE_LABEL);
  assert(
    DataSourcesPage.sourceIcon.isDisplayed(),
    'Source icon is not displayed'
  );
});

Then('number of items in dataset is displayed', () => {
  waitForElement(DataSourcesPage, 'itemsLabel');
  waitForElement(DataSourcesPage, 'itemsValue');

  expect(DataSourcesPage.itemsLabel.getText()).to.equal(ITEMS_LABEL);
  expect(DataSourcesPage.itemsValue.getText()).to.not.be.null;
});

Then('number of fields in dataset is displayed', () => {
  waitForElement(DataSourcesPage, 'fieldsLabel');
  waitForElement(DataSourcesPage, 'fieldsValue');

  expect(DataSourcesPage.fieldsLabel.getText()).to.equal(FIELDS_LABEL);
  expect(DataSourcesPage.fieldsValue.getText()).to.not.be.null;
});

Then('there is no filters amount specified', () => {
  waitForElement(DataSourcesPage, 'filtersLabel');
  waitForElement(DataSourcesPage, 'filtersValue');

  expect(DataSourcesPage.filtersLabel.getText()).to.equal(FILTERS_LABEL);
  expect(DataSourcesPage.filtersValue.getText()).to.equal('—');
});

Then('there is no views amount specified', () => {
  waitForElement(DataSourcesPage, 'viewsLabel');
  waitForElement(DataSourcesPage, 'viewsValue');

  expect(DataSourcesPage.viewsLabel.getText()).to.equal(VIEWS_LABEL);
  expect(DataSourcesPage.viewsValue.getText()).to.equal('—');
});

Then('Back button on Data Sources page is displayed', () => {
  waitForElement(DataSourcesPage, 'backBtn');

  assert(DataSourcesPage.backBtn.isDisplayed(), 'Back button is not displayed');
});

Then('Create data source button is displayed', () => {
  waitForElement(DataSourcesPage, 'createDataSourceBtn');

  assert(
    DataSourcesPage.createDataSourceBtn.isDisplayed(),
    'Create data source button is not displayed'
  );
});
