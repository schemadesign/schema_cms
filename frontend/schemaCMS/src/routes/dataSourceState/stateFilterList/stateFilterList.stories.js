import React from 'react';
import { storiesOf } from '@storybook/react';

import { StateFilterList } from './stateFilterList.component';
import { state } from '../../../modules/dataSourceState/dataSourceState.mock';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  setFieldValue: Function.prototype,
  state,
  filters: [],
  values: [],
};

storiesOf('DataSourceState/StateFilterList', module)
  .addDecorator(withTheme())
  .add('Default', () => <StateFilterList {...defaultProps} />);
