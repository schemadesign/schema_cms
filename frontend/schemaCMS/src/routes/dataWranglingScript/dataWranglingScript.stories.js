import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataWranglingScript } from './dataWranglingScript.component';

import { withTheme } from '../../.storybook/decorators';
import { history, intl } from '../../.storybook/helpers';
import mockScripts, { BLANK_CELLS } from '../../modules/dataWranglingScripts/scripts.mock';

export const defaultProps = {
  // eslint-disable-next-line import/no-named-as-default-member
  dataWranglingScript: mockScripts[BLANK_CELLS],
  fetchDataWranglingScript: Function.prototype,
  isAdmin: true,
  history,
  intl,
  match: {
    params: {
      projectId: '1',
      dataSourceId: '1',
      scriptId: '1',
      step: '3',
    },
  },
};

const emptyProps = {
  ...defaultProps,
  dataWranglingScript: {},
};

storiesOf('Data Wrangling Script|DataWranglingScript', module)
  .addDecorator(withTheme())
  .add('No data', () => <DataWranglingScript {...emptyProps} />)
  .add('Default', () => <DataWranglingScript {...defaultProps} />);
