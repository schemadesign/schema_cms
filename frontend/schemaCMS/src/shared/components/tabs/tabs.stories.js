import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { Tabs } from './tabs.component';

export const defaultProps = {
  tabs: [
    { to: '/', content: 'Tab 1', id: 'tab1' },
    { to: '/', content: 'Tab 2', id: 'tab2', active: true },
    { to: '/', content: 'Tab 3 Lorem ipsum dolor sit amet, consectetur adipiscing elit', id: 'tab3' },
    { to: '/', content: 'Tab 4', id: 'tab4' },
  ],
};

storiesOf('Shared Components|Tabs', module)
  .addDecorator(withTheme())
  .add('Default', () => <Tabs {...defaultProps} />);
