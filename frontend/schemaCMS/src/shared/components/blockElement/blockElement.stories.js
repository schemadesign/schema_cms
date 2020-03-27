import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockElement } from './blockElement.component';
import { element } from '../../../modules/page/page.mocks';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  element,
};

storiesOf('BlockElement', module)
  .addDecorator(withTheme())
  .add('Default', () => <BlockElement {...defaultProps} />);
