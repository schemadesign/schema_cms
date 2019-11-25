import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageList } from './pageList.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  fetchPages: Function.prototype,
  fetchDirectory: Function.prototype,
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
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
      metaData: {
        blocks: 8,
      },
    },
  ],
  directory: {
    project: '1',
  },
  match: {
    params: {
      directoryId: '1',
    },
  },
  history: {
    push: Function.prototype,
  },
};

storiesOf('Directory/PageList', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageList {...defaultProps} />);
