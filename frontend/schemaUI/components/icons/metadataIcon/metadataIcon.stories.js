import React from 'react';
import { storiesOf } from '@storybook/react';

import { MetadataIcon } from './metadataIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const customStyles = { customStyles: { stroke: 'blue' } };

storiesOf('Icons/MetadataIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <MetadataIcon />)
  .add('with custom styles', () => <MetadataIcon {...customStyles} />);
