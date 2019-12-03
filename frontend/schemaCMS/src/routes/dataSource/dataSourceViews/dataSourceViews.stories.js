import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceViews } from './dataSourceViews.component';

const defaultProps = {};

storiesOf('DataSourceViews', module).add('Default', () => <DataSourceViews {...defaultProps} />);
