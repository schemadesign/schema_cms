import React from 'react';
import { storiesOf } from '@storybook/react';

import { Jwt } from './jwt.component';

const defaultProps = {};

storiesOf('Jwt', module).add('Default', () => <Jwt {...defaultProps} />);
