import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
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

const getBreadcrumbsItems = (project, { id, name }) => [
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
    path: `/section/${id}`,
    span: sectionMessage,
    h3: name,
  },
  {
    path: `/section/${id}/create-page`,
    span: pageBlockMessage,
    h3: createMessage,
  },
  {
    path: `/section/${id}/create-page/add-block`,
    active: true,
    span: pageMessage,
    h3: createMessage,
  },
];

export const AddBlock = ({ fetchBlockTemplates, project, userRole, blockTemplates, section }) => {
  const intl = useIntl();
  const { sectionId } = useParams();
  const projectId = project.id;
  const title = intl.formatMessage(messages.title);
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(projectId);

  return (
    <Container>
      <Helmet title={title} />
      <MobileMenu headerTitle={title} headerSubtitle={subtitle} options={filterMenuOptions(menuOptions, userRole)} />
      <ProjectBreadcrumbs items={getBreadcrumbsItems(project, section)} />
      <ContextHeader title={title} subtitle={subtitle} />
      <AddBlockForm
        fetchBlockTemplates={fetchBlockTemplates}
        projectId={projectId}
        blockTemplates={blockTemplates}
        backUrl={`/section/${sectionId}/create-page`}
        title={title}
      />
    </Container>
  );
};

AddBlock.propTypes = {
  fetchBlockTemplates: PropTypes.func.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  section: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
};
