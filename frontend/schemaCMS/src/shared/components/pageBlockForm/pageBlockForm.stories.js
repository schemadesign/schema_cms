import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageBlockForm } from './pageBlockForm.component';

const defaultProps = {};

storiesOf('PageBlockForm', module).add('Default', () => <PageBlockForm {...defaultProps} />);
