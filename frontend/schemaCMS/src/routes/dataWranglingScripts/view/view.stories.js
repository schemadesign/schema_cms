import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';

import mockScripts, { BLANK_CELLS } from '../../../modules/dataWranglingScripts/scripts.mock';

export const defaultProps = {
  dataWrangling: mockScripts[BLANK_CELLS],
  fetchDataWrangling: Function.prototype,
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

storiesOf('Project/DataSource/View/DataWrangling/View', module).add('Default', () => <View {...defaultProps} />);
