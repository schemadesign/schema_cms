import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageForm } from './pageForm.component';

const defaultProps = {};

storiesOf('PageForm', module).add('Default', () => <PageForm {...defaultProps} />);
