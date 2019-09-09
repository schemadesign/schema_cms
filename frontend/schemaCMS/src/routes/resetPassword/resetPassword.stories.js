import React from 'react';
import { storiesOf } from '@storybook/react';

import { ResetPassword } from './resetPassword.component';

const defaultProps = {};

storiesOf('ResetPassword', module).add('Default', () => <ResetPassword {...defaultProps} />);
