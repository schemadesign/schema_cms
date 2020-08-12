import TopHeader from '../Components/TopHeader/topHeader.component';
import Tabs from '../Components/Tabs/tabs.component';
import { createSelectors } from '../../helpers/utils';
import { clickElement } from '../../helpers/actions';
import { expectElemsNotToBeEmpty, expectToBeDisplayed, expectElemsToHaveText } from '../../helpers/expect';
import { PROJECT_SETTINGS_ELEMENT_VALUES } from './projectSettings.constants';

const singleSelectors = {
  projectRemovalConfirmationModal: '#projectConfirmationRemovalModal',
  projectRemovalConfirmationModalTitle: '#projectConfirmationRemovalModalTitle',
  confirmProjectRemovalBtn: '#projectConfirmationRemovalModalConfirmBtn',
  cancelProjectRemovalBtn: '#projectConfirmationRemovalModalCancelBtn',
};

const multiSelectors = {};

const textSelectors = {
  dataSourcesTileLabel: '#projectDataSources span',
  pagesTileLabel: '#projectPages span',
  usersTileLabel: '#projectUsers span',
  lastUpdateLabel: '#fieldLastUpdatedLabel',
  titleLabel: '#fieldTitleLabel',
  ownerLabel: '#fieldOwnerLabel',
  statusLabel: '#fieldStatusLabel',
  apiPathLabel: '#fieldSlugLabel',
  domainLabel: '#fieldDomainLabel',
  descriptionLabel: '#fieldDescriptionLabel',
  deleteProjectBtn: '#deleteProjectDesktopBtn',
};

const ctaSelectors = {
  dataSourcesTile: '#projectDataSources',
  pagesTile: '#projectPages',
  usersTile: '#projectUsers',
  backBtn: '#backProjectBtn',
  saveBtn: 'button=Save',
};

const attributeSelectors = {
  dataSourcesTileValue: '#projectDataSourcesValue',
  pagesTileValue: '#projectPagesValue',
  usersTileValue: '#projectUsersValue',
  lastUpdateValue: '#fieldLastUpdatedValue',
  statusValue: '#fieldStatus > div > div:nth-child(2) > div > div:nth-child(1) > div',
  apiPathValue: '#fieldSlugValue',
  domainValue: '#domain',
  ownerValue: '#fieldOwnerValue',
  titleValue: '#title',
  descriptionValue: '#description',
};

const projectTileSelectors = {
  lastUpdateValue: '#fieldLastUpdatedValue',
  statusValue: '#fieldStatus > div > div:nth-child(2) > div > div:nth-child(1) > div',
  ownerValue: '#fieldOwnerValue',
  titleValue: '#title',
  descriptionValue: '#description',
  apiPathValue: '#fieldSlugValue',
};

const convertedTextSelectors = createSelectors([textSelectors], []);
const convertedCtaSelectors = createSelectors([ctaSelectors], []);
const convertedAttributeSelectors = createSelectors([attributeSelectors], []);
const convertedProjectTileSelectors = createSelectors([projectTileSelectors], []);

const deleteProject = ProjectSettings => () => {
  clickElement(ProjectSettings.deleteProjectBtn());
  clickElement(ProjectSettings.confirmProjectRemovalBtn());
};

const expectProjectSettingsPageToMatchDesign = () => () => {
  TopHeader.expectTopHeaderToBeDisplayed();
  Tabs.expectTabsToBeDisplayed();
  expectToBeDisplayed(convertedCtaSelectors);
  expectElemsToHaveText(convertedTextSelectors, PROJECT_SETTINGS_ELEMENT_VALUES);
  expectElemsNotToBeEmpty(convertedAttributeSelectors);
};

const expectProjectSettingsToMatchDataOnTile = () => tileValues => {
  expectElemsToHaveText(convertedProjectTileSelectors, tileValues);
};

const getFunctions = ProjectSettings => ({
  deleteProject: deleteProject(ProjectSettings),
  expectProjectSettingsPageToMatchDesign: expectProjectSettingsPageToMatchDesign(ProjectSettings),
  expectProjectTileToHaveProperData: expectProjectSettingsToMatchDataOnTile(ProjectSettings),
});

const convertedSelectors = createSelectors(
  [singleSelectors, textSelectors, ctaSelectors, attributeSelectors, projectTileSelectors],
  [multiSelectors]
);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
