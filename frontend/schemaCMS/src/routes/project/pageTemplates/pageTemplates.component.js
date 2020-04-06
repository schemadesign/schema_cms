import React, { Fragment, useState } from 'react';
import { useEffectOnce } from 'react-use';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import Helmet from 'react-helmet';

import { Container } from './pageTemplates.styles';
import messages from './pageTemplates.messages';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions } from '../project.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackArrowButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
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
    path: `/project/${project.id}/page-templates`,
    active: true,
    span: libraryMessage,
    h3: pageTemplatesMessage,
  },
];

const PageTemplate = ({ created, createdBy, name, id, blocks }) => {
  const history = useHistory();
  const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
  const list = [whenCreated, createdBy];
  const header = <CardHeader list={list} />;
  const footer = <FormattedMessage {...messages.blocksCounter} values={{ blocks: blocks.length }} />;

  return (
    <ListItem headerComponent={header} footerComponent={footer}>
      <ListItemTitle id={`pageTemplateTitle-${id}`} onClick={() => history.push(`/page-template/${id}`)}>
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
};

export const PageTemplates = ({ fetchPageTemplates, pageTemplates, userRole, project }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intl = useIntl();
  const history = useHistory();
  const { projectId } = useParams();
  const menuOptions = getProjectMenuOptions(projectId);
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const noData = <FormattedMessage {...messages.noData} />;

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchPageTemplates({ projectId });
      } catch (e) {
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
        <PlusButton
          id="createPageTemplate"
          onClick={() => history.push(`/project/${projectId}/page-templates/create`)}
        />
      </ContextHeader>
      <LoadingWrapper loading={loading} error={error} noDataContent={noData} noData={!pageTemplates.length}>
        <Fragment>
          <CounterHeader moveToTop copy={intl.formatMessage(messages.pageTemplate)} count={pageTemplates.length} />
          <ListContainer>
            {pageTemplates.map((page, index) => (
              <PageTemplate key={index} {...page} />
            ))}
          </ListContainer>
        </Fragment>
      </LoadingWrapper>
      <NavigationContainer fixed>
        <BackArrowButton id="backBtn" onClick={() => history.push(`/project/${projectId}/templates`)} />
        <PlusButton
          hideOnDesktop
          id="createPageTemplateMobile"
          onClick={() => history.push(`/project/${projectId}/page-templates/create`)}
        />
      </NavigationContainer>
    </Container>
  );
};

PageTemplates.propTypes = {
  userRole: PropTypes.string.isRequired,
  pageTemplates: PropTypes.array.isRequired,
  fetchPageTemplates: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};
