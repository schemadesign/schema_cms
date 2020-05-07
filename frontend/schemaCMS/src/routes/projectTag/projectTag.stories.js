import React from 'react';
import { storiesOf } from '@storybook/react';

import { ProjectTag } from './projectTag.component';
import { withTheme } from '../../.storybook/decorators';
import { history, intl } from '../../.storybook/helpers';
import { ROLES } from '../../modules/userProfile/userProfile.constants';
import { project } from '../../modules/project/project.mocks';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  isSubmitting: false,
  dirty: false,
  isValid: true,
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  updateTag: Function.prototype,
  fetchTag: () => Promise.resolve({ project }),
  removeTag: Function.prototype,
  tag: {
    id: 2,
    project,
    name: 'name',
    tags: [{ id: 1, value: 'value' }],
  },
  values: {
    name: 'name',
    tags: [{ id: 1, value: 'value' }],
  },
  history,
  intl,
  match: {
    params: {
      tagId: '1',
    },
  },
};

storiesOf('ProjectTag', module)
  .addDecorator(withTheme())
  .add('Default', () => <ProjectTag {...defaultProps} />);
