import { camelize } from 'humps';
import { createSelectors } from '../../../helpers/utils';
import { clickElement } from '../../../helpers/actions';

const singleSelectors = {
  addBlockTemplateBtn: '#createBlockTemplate',
};

const multiSelectors = {};

const getElementsCounter = () => numOfElements =>
  numOfElements.length > 1 ? `${numOfElements.length} Elements` : `${numOfElements.length} Element`;

const openBlockTemplateByName = () => blockTemplateName =>
  clickElement($(`#blockTemplateTitle-${camelize(blockTemplateName)}`));

const getFunctions = BlockTemplates => ({
  openBlockTemplateByName: openBlockTemplateByName(BlockTemplates),
  getElementsCounter: getElementsCounter(BlockTemplates),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
