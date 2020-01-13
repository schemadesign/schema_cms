import React from 'react';
import { storiesOf } from '@storybook/react';

import { Edit } from './edit.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { FOLDER_NAME } from '../../../modules/folder/folder.constants';

export const defaultProps = {
  values: {
    [FOLDER_NAME]: 'name',
  },
  folder: {
    name: 'name',
    project: { id: '1' },
  },
  isValid: true,
  isSubmitting: false,
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  handleBlur: Function.prototype,
  updateFolder: Function.prototype,
  fetchFolder: Function.prototype,
  removeFolder: Function.prototype,
  history,
  intl,
  match: {
    params: {
      folderId: '1',
    },
  },
};

storiesOf('Folder|Edit', module)
  .addDecorator(withTheme())
  .add('Default', () => <Edit {...defaultProps} />);
