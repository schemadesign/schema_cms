import React from 'react';
import { storiesOf } from '@storybook/react';

import { Header } from './header.component';

const defaultProps = {};

storiesOf('Header', module).add('Default', () => <Header {...defaultProps} />);
