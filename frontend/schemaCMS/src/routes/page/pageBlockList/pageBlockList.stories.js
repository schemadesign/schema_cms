import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageBlockList } from './pageBlockList.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';

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
  history,
  intl,
  match: {
    params: {
      pageId: '1',
    },
  },
};

storiesOf('Page|PageBlockList', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageBlockList {...defaultProps} />);
