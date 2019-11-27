import React from 'react';
import { storiesOf } from '@storybook/react';

import { FolderList } from './folderList.component';
import { withRouter, withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  folders: [
    {
      id: '1',
      name: 'name',
      created: '2019-11-18T14:17:06+0000',
      createdBy: {
        firstName: 'firstName',
        lastName: 'lastName',
      },
    },
  ],
  fetchFolders: Function.prototype,
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
  history: { push: Function.prototype },
  match: {
    params: {
      projectId: '1',
    },
  },
};

storiesOf('Project|FolderList', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Default', () => <FolderList {...defaultProps} />);
