import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageForm } from './pageForm.component';
import { withTheme } from '../../../.storybook/decorators';
import { page } from '../../../modules/page/page.mocks';
import { pageTemplates } from '../../../modules/pageTemplates/pageTemplates.mocks';

export const defaultProps = {
  handleChange: Function.prototype,
  setValues: Function.prototype,
  setFieldValue: Function.prototype,
  setRemoveModalOpen: Function.prototype,
  values: page,
  pageTemplates,
  isValid: true,
  title: 'title',
  displayName: 'displayName',
};

storiesOf('PageForm', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageForm {...defaultProps} />);
