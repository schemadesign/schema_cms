import React from 'react';
import { storiesOf } from '@storybook/react';

import { Edit } from './edit.component';
import { withTheme } from '../../../.storybook/decorators';
import { DIRECTORY_NAME } from '../../../modules/directory/directory.constants';

export const defaultProps = {
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
  values: {
    [DIRECTORY_NAME]: 'name',
  },
  directory: {
    name: 'name',
    project: '1',
  },
  isValid: true,
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  handleBlur: Function.prototype,
  fetchDirectory: Function.prototype,
  match: {
    params: {
      directoryId: '1',
    },
  },
  history: {
    push: Function.prototype,
  },
};

storiesOf('Edit', module)
  .addDecorator(withTheme())
  .add('Default', () => <Edit {...defaultProps} />);
