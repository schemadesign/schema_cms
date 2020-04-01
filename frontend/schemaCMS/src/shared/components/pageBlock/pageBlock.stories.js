import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageBlock } from './pageBlock.component';
import { withTheme } from '../../../.storybook/decorators';
import { block } from '../../../modules/page/page.mocks';
import { blockTemplates } from '../../../modules/blockTemplates/blockTemplates.mocks';

export const defaultProps = {
  block,
  index: 0,
  draggableIcon: <div>icon</div>,
  removeBlock: Function.prototype,
  handleChange: Function.prototype,
  blockTemplates,
  valuePath: 'valuePath',
};

storiesOf('PageBlock', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageBlock {...defaultProps} />);
