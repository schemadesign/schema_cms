import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageBlockList } from './pageBlockList.component';
import { withRouter, withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  pageBlocks: [
    {
      name: 'block 1',
      isActive: true,
      id: 1,
    },
    {
      name: 'block 2',
      isActive: false,
      id: 2,
    },
  ],
  page: {
    folder: {
      id: '1',
    },
  },
  fetchPageBlocks: Function.prototype,
  fetchPage: Function.prototype,
  setPageBlocks: Function.prototype,
  match: {
    params: {
      pageId: '1',
    },
  },
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
  history: { push: Function.prototype },
};

storiesOf('BlockList', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Default', () => <PageBlockList {...defaultProps} />);
