import React from 'react';
import { storiesOf } from '@storybook/react';

import { AddBlockForm } from './addBlockForm.component';

export const defaultProps = {};

storiesOf('AddBlockForm', module).add('Default', () => <AddBlockForm {...defaultProps} />);
