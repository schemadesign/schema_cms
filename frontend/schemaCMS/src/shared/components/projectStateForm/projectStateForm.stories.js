import React from 'react';
import { storiesOf } from '@storybook/react';

import { ProjectStateForm } from './projectStateForm.component';
import { intl } from '../../../.storybook/helpers';
import { withTheme } from '../../../.storybook/decorators';
import { state } from '../../../modules/projectState/projectState.mock';

export const defaultProps = {
  intl,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  values: state,
  state,
  dataSources: [{ name: 'name', id: 'id' }],
};

storiesOf('ProjectStateForm', module)
  .addDecorator(withTheme())
  .add('Default', () => <ProjectStateForm {...defaultProps} />);
