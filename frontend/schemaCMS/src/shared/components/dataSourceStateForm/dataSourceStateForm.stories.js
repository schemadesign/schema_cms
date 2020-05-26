import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceStateForm } from './dataSourceStateForm.component';
import { intl } from '../../../.storybook/helpers';
import { withTheme } from '../../../.storybook/decorators';
import { state } from '../../../modules/dataSourceState/dataSourceState.mock';

export const defaultProps = {
  intl,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  values: state,
  state,
  dataSources: [{ name: 'name', id: 'id' }],
};

storiesOf('DataSourceStateForm', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataSourceStateForm {...defaultProps} />);
