import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceTag } from './dataSourceTag.component';

const defaultProps = {};

storiesOf('DataSourceTag', module).add('Default', () => <DataSourceTag {...defaultProps} />);
