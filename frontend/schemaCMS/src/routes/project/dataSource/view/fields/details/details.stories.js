import React from 'react';
import { storiesOf } from '@storybook/react';

import { Details } from './details.component';

const defaultProps = {};

storiesOf('Project/DataSource/View/Fields/Details', module).add('Default', () => <Details {...defaultProps} />);
