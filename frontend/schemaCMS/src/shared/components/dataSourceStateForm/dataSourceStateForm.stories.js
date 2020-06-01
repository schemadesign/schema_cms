import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceStateForm } from './dataSourceStateForm.component';
import { withTheme } from '../../../.storybook/decorators';
import { state } from '../../../modules/dataSourceState/dataSourceState.mock';
import { tagCategories } from '../../../modules/tagCategory/tagCategory.mocks';
import { filters } from '../../../modules/filter/filter.mocks';

export const defaultProps = {
  tagCategories,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  values: state,
  filters,
  state,
};

storiesOf('Shared Components|DataSourceStateForm', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataSourceStateForm {...defaultProps} />);
