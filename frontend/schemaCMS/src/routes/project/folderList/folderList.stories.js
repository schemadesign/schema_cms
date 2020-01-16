import React from 'react';
import { storiesOf } from '@storybook/react';

import { FolderList } from './folderList.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
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
  history,
  intl,
  match: {
    params: {
      projectId: '1',
    },
  },
};

const noDataProps = {
  ...defaultProps,
  folders: [],
};

storiesOf('Project|FolderList', module)
  .addDecorator(withTheme())
  .add('No data', () => <FolderList {...noDataProps} />)
  .add('Default', () => <FolderList {...defaultProps} />);
