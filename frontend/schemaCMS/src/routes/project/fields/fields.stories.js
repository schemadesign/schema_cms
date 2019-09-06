import React from 'react';
import { storiesOf } from '@storybook/react';

import { Fields } from './fields.component';

const defaultProps = {};

storiesOf('Fields', module).add('Default', () => <Fields {...defaultProps} />);
