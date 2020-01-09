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
  assert(
    DataSourcesPage.createDataSourceBtn.isDisplayed(),
    'Create data source button is not displayed'
  );
  assert(
    DataSourcesPage.sourceIcon.isDisplayed(),
    'Source icon is not displayed'
  );
});
