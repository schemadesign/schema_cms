import { camelize } from 'humps';
import { createSelectors } from '../../../helpers/utils';
import { clickElement } from '../../../helpers/actions';

const singleSelectors = {
  addTagTemplateBtn: '#addTagCategoryBtn',
  creationDate: '#headerItem-0',
  creator: '#headerItem-1',
  backBtn: '#backBtn',
};

const multiSelectors = {};

const getTagsCounter = () => numOfTags => (numOfTags > 1 ? `${numOfTags} Tags` : `${numOfTags} Tag`);

const openTagTemplateByName = () => tagTemplateName => clickElement($(`#tag-category-${camelize(tagTemplateName)}`));

const getFunctions = TagTemplates => ({
  getTagsCounter: getTagsCounter(TagTemplates),
  openTagTemplateByName: openTagTemplateByName(TagTemplates),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
