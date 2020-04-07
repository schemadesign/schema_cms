import React from 'react';
import { storiesOf } from '@storybook/react';

import {
  blockTemplatesMessage,
  createMessage,
  libraryMessage,
  ProjectBreadcrumbs,
  projectMessage,
  tabMessage,
  templateMessage,
  templatesMessage,
} from './projectBreadcrumbs.component';
import { withTheme } from '../../../.storybook/decorators';

const getBreadcrumbsItems = project => [
  {
    path: `/project/${project.id}/`,
    span: projectMessage,
    h3: project.title,
  },
  {
    path: `/project/${project.id}/templates`,
    span: tabMessage,
    h3: templatesMessage,
  },
  {
    path: `/project/${project.id}/block-templates`,
    span: libraryMessage,
    h3: blockTemplatesMessage,
  },
  {
    path: `/project/${project.id}/page-templates/create`,
    active: true,
    span: templateMessage,
    h3: createMessage,
  },
];

export const defaultProps = {
  items: getBreadcrumbsItems({ id: 1 }),
};

storiesOf('ProjectBreadcrumbs', module)
  .addDecorator(withTheme())
  .add('Default', () => <ProjectBreadcrumbs {...defaultProps} />);
