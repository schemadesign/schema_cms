import React from 'react';
import { storiesOf } from '@storybook/react';

import { UploadIcon } from './uploadIcon.component';

storiesOf('Icons/UploadIcon', module).add('Default', () => <UploadIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('Icons/UploadIcon', module).add('with custom styles', () => <UploadIcon {...defaultProps} />);
