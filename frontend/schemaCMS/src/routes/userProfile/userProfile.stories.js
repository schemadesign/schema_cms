import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserProfile } from './userProfile.component';

const defaultProps = {};

storiesOf('UserProfile', module).add('Default', () => <UserProfile {...defaultProps} />);
