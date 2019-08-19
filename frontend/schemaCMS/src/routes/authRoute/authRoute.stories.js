import React from 'react';
import { storiesOf } from '@storybook/react';

import { AuthRoute } from './authRoute.component';

const defaultProps = {};

storiesOf('AuthRoute', module).add('Default', () => <AuthRoute {...defaultProps} />);
