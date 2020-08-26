import TopHeader from '../Components/TopHeader/topHeader.component';
import SubHeader from '../Components/SubHeader/subHeader.component';
import { createSelectors } from '../../helpers/utils';
import { clickElement } from '../../helpers/actions';
import { expectToBeDisplayed } from '../../helpers/expect';

const singleSelectors = {
  projectCreationDate: '#headerItem-0',
  projectStatus: '#headerItem-1',
  projectOwner: '#headerItem-2',
  projectTitle: '#projectName-0',
  projectDescription: '#projectDescription-0',
  projectApiPath: '#apiPath-0',
};

const multiSelectors = {};

const ctaSelectors = {
  createProjectBtn: '#addProjectDesktopBtn',
};

const convertedSingleSelectors = createSelectors([singleSelectors], []);

const clickFirstProject = Homepage => () => clickElement(Homepage.projectTitle());

const goInsideProject = () => projectName => clickElement($(`h1=${projectName}`));

const expectHomepageToMatchDesign = () => () => {
  expectToBeDisplayed(convertedSingleSelectors);
  TopHeader.expectTopHeaderToBeDisplayed();
  SubHeader.expectSubHeaderToMatchPageUrl(browser.getUrl());
};

const getFunctions = Homepage => ({
  clickFirstProject: clickFirstProject(Homepage),
  goInsideProject: goInsideProject(Homepage),
  expectHomepageToMatchDesign: expectHomepageToMatchDesign(Homepage),
});

const convertedSelectors = createSelectors([singleSelectors, ctaSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
