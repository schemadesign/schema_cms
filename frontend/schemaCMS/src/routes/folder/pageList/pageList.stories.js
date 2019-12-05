import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageList } from './pageList.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';

export const defaultProps = {
  fetchPages: Function.prototype,
  fetchFolder: Function.prototype,
  pages: [
    {
      id: 1,
      name: 'name',
      description: 'description',
      created: '2019-11-18T14:17:06+0000',
      createdBy: {
        firstName: 'firstName',
        lastName: 'lastName',
      },
      meta: {
        blocks: 8,
      },
    },
  ],
  folder: {
    project: '1',
  },
  history,
  intl,
  match: {
    params: {
      folderId: '1',
    },
  },
};

storiesOf('Folder|PageList', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageList {...defaultProps} />);
