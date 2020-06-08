import React from 'react';
import { storiesOf } from '@storybook/react';

import { PublicWarning } from './publicWarning.component';

export const defaultProps = {};

storiesOf('PublicWarning', module).add('Default', () => <PublicWarning {...defaultProps} />);
