import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { SchemaLogoIcon } from './schemaLogoIcon.component';

const defaultProps = { customStyles: { fill: 'orange' } };

storiesOf('Icons/SchemaLogoIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <SchemaLogoIcon />)
  .add('with custom styles', () => <SchemaLogoIcon {...defaultProps} />);
