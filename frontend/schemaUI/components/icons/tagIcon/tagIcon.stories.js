import React from 'react';
import { storiesOf } from '@storybook/react';

import { TagIcon } from './tagIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const customStyles = { customStyles: { stroke: 'blue' } };

storiesOf('Icons/TagIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <TagIcon />)
  .add('with custom styles', () => <TagIcon {...customStyles} />);
