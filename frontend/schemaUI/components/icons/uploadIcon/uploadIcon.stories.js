import React from 'react';
import { storiesOf } from '@storybook/react';

import { UploadIcon } from './uploadIcon.component';
import { withTheme } from '../../../.storybook/decorators';

storiesOf('Icons/UploadIcon', module).add('Default', () => <UploadIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('Icons/UploadIcon', module)
  .addDecorator(withTheme())
  .add('with custom styles', () => <UploadIcon {...defaultProps} />);
