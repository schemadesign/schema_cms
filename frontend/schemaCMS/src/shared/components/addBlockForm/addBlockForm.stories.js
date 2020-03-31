import React from 'react';
import { storiesOf } from '@storybook/react';

import { AddBlockForm } from './addBlockForm.component';
import { blockTemplates } from '../../../modules/blockTemplates/blockTemplates.mocks';
import { project } from '../../../modules/project/project.mocks';

export const defaultProps = {
  fetchBlockTemplates: Function.prototype,
  blockTemplates,
  projectId: project.id,
  backUrl: 'backUrl',
  title: 'title',
};

storiesOf('AddBlockForm', module).add('Default', () => <AddBlockForm {...defaultProps} />);
