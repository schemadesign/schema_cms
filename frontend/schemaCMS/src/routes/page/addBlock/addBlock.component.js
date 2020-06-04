import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import Helmet from 'react-helmet';

import { Container } from './addBlock.styles';
import messages from './addBlock.messages';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { getProjectMenuOptions } from '../../project/project.constants';
import { AddBlockForm } from '../../../shared/components/addBlockForm';
import {
  createMessage,
  pageMessage,
  ProjectBreadcrumbs,
  projectMessage,
  sectionMessage,
  tabMessage,
  contentMessage,
  pageBlockMessage,
} from '../../../shared/components/projectBreadcrumbs';
import { ContextHeader } from '../../../shared/components/contextHeader';

const getBreadcrumbsItems = (project, section, page) => [
  {
    path: `/project/${project.id}/`,
    span: projectMessage,
    h3: project.title,
  },
  {
    path: `/project/${project.id}/content`,
    span: tabMessage,
    h3: contentMessage,
  },
  {
    path: `/section/${section.id}`,
    span: sectionMessage,
    h3: section.name,
  },
  {
    path: `/page/${page.id}`,
    span: pageMessage,
    h3: page.name,
  },
  {
    path: `/page/${page.id}/add-block`,
    active: true,
    span: pageBlockMessage,
    h3: createMessage,
  },
];

export const AddBlock = ({ fetchBlockTemplates, project, userRole, blockTemplates, page }) => {
  const intl = useIntl();
  const { pageId } = useParams();
  const projectId = project.id;
  const title = intl.formatMessage(messages.title);
  const subtitle = intl.formatMessage(messages.subtitle);
  const menuOptions = getProjectMenuOptions(projectId);

  return (
    <Container>
      <Helmet title={title} />
      <MobileMenu headerTitle={title} headerSubtitle={subtitle} options={filterMenuOptions(menuOptions, userRole)} />
      <ProjectBreadcrumbs items={getBreadcrumbsItems(project, page, section, page)} />
      <ContextHeader title={title} subtitle={subtitle} />
      <AddBlockForm
        fetchBlockTemplates={fetchBlockTemplates}
        projectId={projectId}
        blockTemplates={blockTemplates}
        backUrl={`/page/${pageId}`}
      />
    </Container>
  );
};

AddBlock.propTypes = {
  fetchBlockTemplates: PropTypes.func.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
};
