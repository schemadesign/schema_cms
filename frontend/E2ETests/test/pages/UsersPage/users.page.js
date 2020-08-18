import { createSelectors } from '../../helpers/utils';

const singleSelectors = {};

const multiSelectors = {};

const getFunctions = Users => ({});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
