import React from 'react';
import { storiesOf } from '@storybook/react';

import { Create } from './create.component';

const defaultProps = {};

storiesOf('Create', module).add('Default', () => <Create {...defaultProps} />);
