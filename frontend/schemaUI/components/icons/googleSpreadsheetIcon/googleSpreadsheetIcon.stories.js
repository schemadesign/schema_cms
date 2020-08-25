import React from 'react';
import { storiesOf } from '@storybook/react';

import { GoogleSpreadsheetIcon } from './googleSpreadsheetIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = { customStyles: { stroke: 'blue' } };

storiesOf('Icons/GoogleSpreadsheetIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <GoogleSpreadsheetIcon />)
  .add('with custom styles', () => <GoogleSpreadsheetIcon {...defaultProps} />);
