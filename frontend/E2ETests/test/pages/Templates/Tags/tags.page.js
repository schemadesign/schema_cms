import { createSelectors } from '../../../helpers/utils';

const singleSelectors = {
  addTagTemplateBtn: '#addTagCategoryBtn',
  creationDate: '#headerItem-0',
  creator: '#headerItem-1',
  tagsCounter: '#tagContainer div:nth-child(2)',
  backBtn: '#backBtn',
};

const multiSelectors = {};

const getFunctions = Tags => ({});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
