import React from 'react';
import { storiesOf } from '@storybook/react';

import { ArrowRightIcon } from './arrowRightIcon.component';

storiesOf('Icons/ArrowRightIcon', module).add('Default', () => <ArrowRightIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('Icons/ArrowRightIcon', module).add('with custom styles', () => <ArrowRightIcon {...defaultProps} />);
