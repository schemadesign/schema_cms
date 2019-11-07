import React from 'react';
import { storiesOf } from '@storybook/react';

import { withRouter, withTheme } from '../../../.storybook/decorators';
import { Tabs } from './tabs.component';

export const defaultProps = {
  tabs: [
    { to: '/', content: 'Tab 1' },
    { to: '/', content: 'Tab 2', active: true },
    { to: '/', content: 'Tab 3 Lorem ipsum dolor sit amet, consectetur adipiscing elit' },
    { to: '/', content: 'Tab 4' },
  ],
};

storiesOf('Shared Components|Tabs', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Default', () => <Tabs {...defaultProps} />);
