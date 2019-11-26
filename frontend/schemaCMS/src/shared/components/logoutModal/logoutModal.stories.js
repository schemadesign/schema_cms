import React from 'react';
import { storiesOf } from '@storybook/react';

import { LogoutModal } from './logoutModal.component';

const defaultProps = {};

storiesOf('Shared Components|LogoutModal', module).add('Default', () => <LogoutModal {...defaultProps} />);
