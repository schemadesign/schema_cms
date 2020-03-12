import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageTemplateForm } from './pageTemplateForm.component';
import { blockTemplates } from '../../../modules/blockTemplates/blockTemplates.mocks';
import { withTheme } from '../../../.storybook/decorators';
import { pageTemplate } from '../../../modules/pageTemplates/pageTemplates.mocks';

export const defaultProps = {
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  setValues: Function.prototype,
  setRemoveModalOpen: Function.prototype,
  blockTemplates,
  values: pageTemplate,
  isValid: true,
  title: <span>title</span>,
};

storiesOf('PageTemplateForm', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageTemplateForm {...defaultProps} />);
