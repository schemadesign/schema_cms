import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockPageTemplate } from './blockPageTemplate.component';
import { withTheme } from '../../../.storybook/decorators';
import { pageTemplate } from '../../../modules/pageTemplates/pageTemplates.mocks';
import { PAGE_TEMPLATES_BLOCKS } from '../../../modules/pageTemplates/pageTemplates.constants';

export const defaultProps = {
  block: pageTemplate[PAGE_TEMPLATES_BLOCKS][0],
  blocksOptions: [{ label: 'block', value: 'block' }],
  index: 0,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  removeBlock: Function.prototype,
  autoFocus: false,
  draggableIcon: <span>icon</span>,
};

storiesOf('PageBlockTemplate', module)
  .addDecorator(withTheme())
  .add('Default', () => <BlockPageTemplate {...defaultProps} />);
