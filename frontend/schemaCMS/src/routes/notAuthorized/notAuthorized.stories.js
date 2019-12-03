import React from 'react';
import { storiesOf } from '@storybook/react';

import { NotAuthorized } from './notAuthorized.component';

export const defaultProps = {};

storiesOf('NotAuthorized', module).add('Default', () => <NotAuthorized {...defaultProps} />);
