import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router';
import Helmet from 'react-helmet';
import { useEffectOnce } from 'react-use';

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
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ROUTES } from '../../../shared/utils/routes.contants';

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
    span: pageMessage,
    h3: createMessage,
  },
  {
    path: `/section/${id}/create-page${ROUTES.ADD_BLOCK}`,
    active: true,
    span: pageBlockMessage,
    h3: createMessage,
  },
];

export const AddBlock = ({ fetchBlockTemplates, project, userRole, blockTemplates, section, fetchSection }) => {
  const intl = useIntl();
  const { sectionId } = useParams();
  const projectId = project.id;
  const title = intl.formatMessage(messages.title);
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(projectId);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffectOnce(() => {
    (async () => {
      try {
        if (!section.id) {
          await fetchSection({ sectionId });
        }
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  return (
    <LoadingWrapper loading={loading} error={error}>
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
    </LoadingWrapper>
  );
};

AddBlock.propTypes = {
  fetchBlockTemplates: PropTypes.func.isRequired,
  fetchSection: PropTypes.func.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  section: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
};
