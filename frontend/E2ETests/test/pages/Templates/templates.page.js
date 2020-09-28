import { createSelectors } from '../../helpers/utils';
import { clickElement } from '../../helpers/actions';

const singleSelectors = {
  blockTemplatesCard: '#blockTemplates',
  blockTemplatesHeader: '#blockTemplatesHeader',
  blockTemplatesValue: '#blockTemplatesValue',
  pageTemplatesCard: '#pageTemplates',
  pageTemplatesHeader: '#pageTemplatesHeader',
  pageTemplatesValue: '#pageTemplatesValue',
  tagTemplatesCard: '#tagTemplates',
  tagTemplatesHeader: '#tagTemplatesHeader',
  tagTemplatesValue: '#tagTemplatesValue',
};

const navigateToTemplatePage = Templates => pageName => clickElement(Templates[`${pageName}TemplatesCard`]());

const multiSelectors = {};

const getFunctions = Templates => ({
  navigateToTemplatePage: navigateToTemplatePage(Templates),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
