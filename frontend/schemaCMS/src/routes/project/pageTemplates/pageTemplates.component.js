import React, { Fragment, useState } from 'react';
import { useEffectOnce } from 'react-use';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router';
import Helmet from 'react-helmet';

import { Container } from './pageTemplates.styles';
import messages from './pageTemplates.messages';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions } from '../project.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackLink, NavigationContainer, PlusLink, LARGE_BUTTON_SIZE } from '../../../shared/components/navigation';
import { ListContainer, ListItem, ListItemTitle } from '../../../shared/components/listComponents';
import { CardHeader } from '../../../shared/components/cardHeader';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { CounterHeader } from '../../../shared/components/counterHeader';
import {
  pageTemplatesMessage,
  libraryMessage,
  projectMessage,
  tabMessage,
  templatesMessage,
  ProjectBreadcrumbs,
} from '../../../shared/components/projectBreadcrumbs';
import { CopyButton } from '../../../shared/components/copyButton';
import reportError from '../../../shared/utils/reportError';

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
    path: `/project/${project.id}/page-templates`,
    active: true,
    span: libraryMessage,
    h3: pageTemplatesMessage,
  },
];

const PageTemplate = ({ created, createdBy, name, id, blocks, copyPageTemplate, projectId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
  const list = [whenCreated, createdBy];
  const copyPageTemplateAction = async () => {
    try {
      setLoading(true);
      setError(false);
      await copyPageTemplate({ pageTemplateId: id, projectId });
    } catch (e) {
      reportError(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const header = (
    <CardHeader
      list={list}
      icon={
        <CopyButton
          name={`pageTemplateCopyButton-${id}`}
          loading={loading}
          error={error}
          action={copyPageTemplateAction}
        />
      }
    />
  );
  const footer = <FormattedMessage {...messages.blocksCounter} values={{ blocks: blocks.length }} />;

  return (
    <ListItem headerComponent={header} footerComponent={footer}>
      <ListItemTitle id={`pageTemplateTitle-${id}`} to={`/page-template/${id}`}>
        {name}
      </ListItemTitle>
    </ListItem>
  );
};

PageTemplate.propTypes = {
  created: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  blocks: PropTypes.array.isRequired,
  projectId: PropTypes.string.isRequired,
  copyPageTemplate: PropTypes.func.isRequired,
};

export const PageTemplates = ({ fetchPageTemplates, pageTemplates, userRole, project, copyPageTemplate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intl = useIntl();
  const { projectId } = useParams();
  const menuOptions = getProjectMenuOptions(projectId);
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const noData = <FormattedMessage {...messages.noData} />;

  const addTemplateUrl = `/project/${projectId}/page-templates/create`;

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchPageTemplates({ projectId });
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  return (
    <Container>
      <Helmet title={intl.formatMessage(messages.title)} />
      <MobileMenu headerTitle={title} headerSubtitle={subtitle} options={filterMenuOptions(menuOptions, userRole)} />
      <ProjectBreadcrumbs items={getBreadcrumbsItems(project)} />
      <ContextHeader title={title} subtitle={subtitle}>
        <PlusLink id="createPageTemplate" to={addTemplateUrl} size={LARGE_BUTTON_SIZE} />
      </ContextHeader>
      <LoadingWrapper loading={loading} error={error} noDataContent={noData} noData={!pageTemplates.length}>
        <Fragment>
          <CounterHeader moveToTop copy={intl.formatMessage(messages.pageTemplate)} count={pageTemplates.length} />
          <ListContainer>
            {pageTemplates.map((page, index) => (
              <PageTemplate key={index} copyPageTemplate={copyPageTemplate} projectId={projectId} {...page} />
            ))}
          </ListContainer>
        </Fragment>
      </LoadingWrapper>
      <NavigationContainer fixed>
        <BackLink id="backBtn" to={`/project/${projectId}/templates`} />
        <PlusLink hideOnDesktop id="createPageTemplateMobile" to={addTemplateUrl} size={LARGE_BUTTON_SIZE} />
      </NavigationContainer>
    </Container>
  );
};

PageTemplates.propTypes = {
  userRole: PropTypes.string.isRequired,
  pageTemplates: PropTypes.array.isRequired,
  fetchPageTemplates: PropTypes.func.isRequired,
  copyPageTemplate: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};
