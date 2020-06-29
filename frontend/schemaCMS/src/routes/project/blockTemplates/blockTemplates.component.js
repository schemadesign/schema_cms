import React, { Fragment, useState } from 'react';
import { useEffectOnce } from 'react-use';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import Helmet from 'react-helmet';

import { Container } from './blockTemplates.styles';
import messages from './blockTemplates.messages';
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
import { CopyButton } from '../../../shared/components/copyButton';
import {
  blockTemplatesMessage,
  libraryMessage,
  ProjectBreadcrumbs,
  projectMessage,
  tabMessage,
  templatesMessage,
} from '../../../shared/components/projectBreadcrumbs';
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
    path: `/project/${project.id}/block-templates`,
    active: true,
    span: libraryMessage,
    h3: blockTemplatesMessage,
  },
];

const BlockTemplate = ({ copyBlockTemplate, created, createdBy, name, id, elements, projectId }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
  const list = [whenCreated, createdBy];

  const copyBlockTemplateAction = async () => {
    try {
      setLoading(true);
      setError(false);
      await copyBlockTemplate({ blockTemplateId: id, projectId });
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
          name={`blockTemplateCopyButton-${id}`}
          loading={loading}
          error={error}
          action={copyBlockTemplateAction}
        />
      }
    />
  );
  const footer = <FormattedMessage {...messages.elementsCounter} values={{ elements: elements.length }} />;

  return (
    <ListItem headerComponent={header} footerComponent={footer}>
      <ListItemTitle id={`blockTemplateTitle-${id}`} onClick={() => history.push(`/block-template/${id}`)}>
        {name}
      </ListItemTitle>
    </ListItem>
  );
};

BlockTemplate.propTypes = {
  created: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  elements: PropTypes.array.isRequired,
  copyBlockTemplate: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
};

export const BlockTemplates = ({ fetchBlockTemplates, copyBlockTemplate, blockTemplates, userRole, project }) => {
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
        await fetchBlockTemplates({ projectId });
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
          id="createBlockTemplate"
          onClick={() => history.push(`/project/${projectId}/block-templates/create`)}
        />
      </ContextHeader>
      <LoadingWrapper loading={loading} error={error} noDataContent={noData} noData={!blockTemplates.length}>
        {() => (
          <Fragment>
            <CounterHeader moveToTop copy={intl.formatMessage(messages.blockTemplate)} count={blockTemplates.length} />
            <ListContainer>
              {blockTemplates.map((block, index) => (
                <BlockTemplate key={index} projectId={projectId} copyBlockTemplate={copyBlockTemplate} {...block} />
              ))}
            </ListContainer>
          </Fragment>
        )}
      </LoadingWrapper>
      <NavigationContainer fixed>
        <BackArrowButton id="backBtn" onClick={() => history.push(`/project/${projectId}/templates`)} />
        <PlusButton
          hideOnDesktop
          id="createBlockTemplateMobile"
          onClick={() => history.push(`/project/${projectId}/block-templates/create`)}
        />
      </NavigationContainer>
    </Container>
  );
};

BlockTemplates.propTypes = {
  userRole: PropTypes.string.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  fetchBlockTemplates: PropTypes.func.isRequired,
  copyBlockTemplate: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};
