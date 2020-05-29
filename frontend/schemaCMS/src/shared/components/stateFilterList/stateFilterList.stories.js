import React from 'react';
import { storiesOf } from '@storybook/react';

import { StateFilterList } from './stateFilterList.component';
import { state } from '../../../modules/dataSourceState/dataSourceState.mock';
import { withTheme } from '../../../.storybook/decorators';
import { filters } from '../../../modules/filter/filter.mocks';

export const defaultProps = {
  setFieldValue: Function.prototype,
  state,
  filters,
  values: { filters: [{ filter: 1, values: ['George'] }, { filter: 2, values: ['Washington'] }], activeFilters: [1] },
};

storiesOf('Shared Components|StateFilterList', module)
  .addDecorator(withTheme())
  .add('Default', () => <StateFilterList {...defaultProps} />);
