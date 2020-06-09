import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageBlock } from './pageBlock.component';
import { withTheme } from '../../../.storybook/decorators';
import { block } from '../../../modules/page/page.mocks';
import { blockTemplates } from '../../../modules/blockTemplates/blockTemplates.mocks';
import { pagerUrlOptions } from '../../../modules/sections/sections.mocks';

export const defaultProps = {
  block,
  index: 0,
  draggableIcon: <div>icon</div>,
  removeBlock: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  blockTemplates,
  formikFieldPath: 'formikFieldPath',
  pagerUrlOptions,
  stateOptions: [],
};

storiesOf('PageBlock', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageBlock {...defaultProps} />);
