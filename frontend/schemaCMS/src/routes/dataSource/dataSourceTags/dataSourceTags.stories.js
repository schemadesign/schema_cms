import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceTags } from './dataSourceTags.component';

export const defaultProps = {};

storiesOf('DataSourceTags', module).add('Default', () => <DataSourceTags {...defaultProps} />);
