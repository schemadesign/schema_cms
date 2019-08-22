import React from 'react';
import { storiesOf } from '@storybook/react';

import { ArrowLeftIcon } from './arrowLeftIcon.component';

storiesOf('Icons/ArrowLeftIcon', module).add('Default', () => <ArrowLeftIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('Icons/ArrowLeftIcon', module).add('with custom styles', () => <ArrowLeftIcon {...defaultProps} />);
