import React from 'react';
import { storiesOf } from '@storybook/react';

import { MobileMenu } from './mobileMenu.component';
import { LINK_ITEM } from './mobileMenu.constants';
import { withTheme } from '../../../../.storybook/decorators';

export const defaultProps = {
  headerTitle: <div>Header Title</div>,
  headerSubtitle: <div>Header SubTitle</div>,
  options: [
    {
      label: 'A label',
      to: '/sample/',
      id: '1',
      type: LINK_ITEM,
    },
    {
      label: 'Another label',
      to: '/sample/url',
      id: '2',
      type: LINK_ITEM,
    },
  ],
};

storiesOf('MobileMenu', module)
  .addDecorator(withTheme())
  .add('Default', () => <MobileMenu {...defaultProps} />);
