import React from 'react';
import { storiesOf } from '@storybook/react';

import { SortingSelect } from './sortingSelect.component';

export const defaultProps = {};

storiesOf('SortingSelect', module).add('Default', () => <SortingSelect {...defaultProps} />);
