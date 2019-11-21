import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateDirectory } from './createDirectory.component';

const defaultProps = {};

storiesOf('CreateDirectory', module).add('Default', () => <CreateDirectory {...defaultProps} />);
