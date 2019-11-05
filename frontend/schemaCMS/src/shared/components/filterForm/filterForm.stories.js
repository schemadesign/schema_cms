import React from 'react';
import { storiesOf } from '@storybook/react';

import { FilterForm } from './filterForm.component';

const defaultProps = {};

storiesOf('FilterForm', module).add('Default', () => <FilterForm {...defaultProps} />);
