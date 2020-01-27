import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceTagForm } from './dataSourceTagForm.component';

const defaultProps = {};

storiesOf('DataSourceTagForm', module).add('Default', () => <DataSourceTagForm {...defaultProps} />);
