import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';

import mockScripts, { BLANK_CELLS } from '../../../modules/dataWranglingScripts/scripts.mock';

export const defaultProps = {
  dataWranglingScript: mockScripts[BLANK_CELLS],
  fetchDataWranglingScript: Function.prototype,
  unmountDataWrangling: Function.prototype,
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  history: {
    push: Function.prototype,
  },
  match: {
    params: {
      projectId: '1',
      dataSourceId: '1',
      scriptId: '1',
    },
  },
};

storiesOf('DataWranglingScripts/View', module).add('Default', () => <View {...defaultProps} />);
