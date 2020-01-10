import React from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopMenu } from './desktopMenu.component';

const defaultProps = {};

storiesOf('DesktopMenu', module).add('Default', () => <DesktopMenu {...defaultProps} />);
