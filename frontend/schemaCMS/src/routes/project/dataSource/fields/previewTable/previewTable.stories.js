import React from 'react';
import { storiesOf } from '@storybook/react';

import { PreviewTable } from './previewTable.component';

const defaultProps = {};

storiesOf('PreviewTable', module).add('Default', () => <PreviewTable {...defaultProps} />);
