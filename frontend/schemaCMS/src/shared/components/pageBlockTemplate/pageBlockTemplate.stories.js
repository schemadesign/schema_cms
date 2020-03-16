import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageBlockTemplate } from './pageBlockTemplate.component';
import { blockTemplate } from '../../../modules/blockTemplates/blockTemplates.mocks';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  element: blockTemplate.elements[0],
  blocksOptions: [{ label: 'block', value: 'block' }],
  index: 0,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  removeElement: Function.prototype,
  autoFocus: false,
  draggableIcon: <span>icon</span>,
};

storiesOf('PageBlockTemplate', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageBlockTemplate {...defaultProps} />);
