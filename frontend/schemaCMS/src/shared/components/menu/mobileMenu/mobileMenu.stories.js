import React from 'react';
import { storiesOf } from '@storybook/react';

import { MobileMenu } from './mobileMenu.component';

const defaultProps = {};

storiesOf('MobileMenu', module).add('Default', () => <MobileMenu {...defaultProps} />);
