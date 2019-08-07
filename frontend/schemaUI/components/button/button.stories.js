import React from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from './button.component';

const defaultProps = {};

storiesOf('Button', module).add('Default', () => <Button {...defaultProps} />);
