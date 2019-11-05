import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateFilter } from './createFilter.component';

const defaultProps = {};

storiesOf('CreateFilter', module).add('Default', () => <CreateFilter {...defaultProps} />);
