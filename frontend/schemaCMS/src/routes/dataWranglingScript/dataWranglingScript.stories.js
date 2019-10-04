import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataWranglingScript } from './dataWranglingScript.component';

import { withTheme } from '../../.storybook/decorators';
import mockScripts, { BLANK_CELLS } from '../../modules/dataWranglingScripts/scripts.mock';

export const defaultProps = {
  // eslint-disable-next-line import/no-named-as-default-member
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

storiesOf('DataWranglingScripts/View', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataWranglingScript {...defaultProps} />);
