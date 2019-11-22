import React from 'react';
import { storiesOf } from '@storybook/react';

import { DirectoryList } from './directoryList.component';
import { withRouter, withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  directories: [
    {
      id: 1,
      name: 'name',
      created: '2019-11-18T14:17:06+0000',
      createdBy: {
        firstName: 'firstName',
        lastName: 'lastName',
      },
    },
  ],
  fetchDirectories: Function.prototype,
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
  history: { push: Function.prototype },
  match: {
    params: {
      projectId: '1',
    },
  },
};

storiesOf('DirectoryList', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Default', () => <DirectoryList {...defaultProps} />);
