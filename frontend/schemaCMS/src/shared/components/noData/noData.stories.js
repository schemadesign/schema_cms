import React from 'react';
import { storiesOf } from '@storybook/react';

import { NoData } from './noData.component';
import { withTheme } from '../../../.storybook/decorators';

storiesOf('Shared Components|NoData', module)
  .addDecorator(withTheme())
  .add('default', () => <NoData />)
  .add('custom', () => <NoData>No Projects</NoData>);
