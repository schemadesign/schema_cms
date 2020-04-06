import React from 'react';
import { storiesOf } from '@storybook/react';

import {
  blockTemplatesMessage, createMessage,
  libraryMessage,
  ProjectBreadcrumbs,
  projectMessage,
  tabMessage,
  templateMessage,
  templatesMessage
} from './projectBreadcrumbs.component';

const getBreadcrumbsItems = project => [
  {
    path: `/project/${project.id}/`,
    active: false,
    span: projectMessage,
    h3: project.title,
  },
  {
    path: `/project/${project.id}/templates`,
    active: false,
    span: tabMessage,
    h3: templatesMessage,
  },
  {
    path: `/project/${project.id}/block-templates`,
    active: false,
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

storiesOf('ProjectBreadcrumbs', module).add('Default', () => <ProjectBreadcrumbs {...defaultProps} />);
