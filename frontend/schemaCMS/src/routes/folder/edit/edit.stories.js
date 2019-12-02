import React from 'react';
import { storiesOf } from '@storybook/react';

import { Edit } from './edit.component';
import { withTheme } from '../../../.storybook/decorators';
import { FOLDER_NAME } from '../../../modules/folder/folder.constants';

export const defaultProps = {
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
  values: {
    [FOLDER_NAME]: 'name',
  },
  folder: {
    name: 'name',
    project: '1',
  },
  isValid: true,
  isSubmitting: false,
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  handleBlur: Function.prototype,
  fetchFolder: Function.prototype,
  removeFolder: Function.prototype,
  match: {
    params: {
      folderId: '1',
    },
  },
  history: {
    push: Function.prototype,
  },
};

storiesOf('Folder|Edit', module)
  .addDecorator(withTheme())
  .add('Default', () => <Edit {...defaultProps} />);
