import React from 'react';
import { storiesOf } from '@storybook/react';

import { TagSearch } from './tagSearch.component';

export const defaultProps = {};

storiesOf('TagSearch', module).add('Default', () => <TagSearch {...defaultProps} />);
