import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { useIntl } from 'react-intl';
import { useParams, useHistory } from 'react-router';
import { useEffectOnce, useUnmount } from 'react-use';

import { ProjectTabs } from '../../../shared/components/projectTabs';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ListContainer } from '../../../shared/components/listComponents';
import { BackArrowButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { SOURCES } from '../../../shared/components/projectTabs/projectTabs.constants';
import { Container } from './dataSourceList.styles';
import messages from './dataSourceList.messages';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions, PROJECT_DATASOURCE_ID } from '../project.constants';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { DataSourceCard } from './dataSourceCard.component';

export const DataSourceList = ({
  fetchDataSources,
  cancelFetchListLoop,
  dataSources = [],
  userRole,
  uploadingDataSources,
  copyDataSource,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams();
  const intl = useIntl();
  const history = useHistory();

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchDataSources({ projectId });
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  useUnmount(cancelFetchListLoop);

  const getLoadingConfig = (loading, error, dataSources) => ({
    loading,
    error,
    noData: !dataSources.length,
    noDataContent: intl.formatMessage(messages.noData),
  });

  const handleShowProject = () => history.push(`/project/${projectId}`);

  const handleCreateDataSource = () => history.push(`/project/${projectId}/datasource/add`);

  const renderList = renderWhenTrue(() => (
    <ListContainer>
      {dataSources.map((dataSource, index) => (
        <DataSourceCard
          uploadingDataSources={uploadingDataSources}
          copyDataSource={copyDataSource}
          index={index}
          key={index}
          projectId={projectId}
          {...dataSource}
        />
      ))}
    </ListContainer>
  ));

  const title = intl.formatMessage(messages.title);
  const subtitle = intl.formatMessage(messages.subTitle);
  const loadingConfig = getLoadingConfig(loading, error, dataSources);
  const menuOptions = getProjectMenuOptions(projectId);

  return (
    <Container>
      <Helmet title={intl.formatMessage(messages.title)} />
      <MobileMenu
        headerTitle={title}
        headerSubtitle={subtitle}
        options={filterMenuOptions(menuOptions, userRole)}
        active={PROJECT_DATASOURCE_ID}
      />
      <ProjectTabs active={SOURCES} url={`/project/${projectId}`} />
      <ContextHeader title={title} subtitle={subtitle}>
        <PlusButton id="createDataSourceDesktopBtn" onClick={handleCreateDataSource} />
      </ContextHeader>
      <LoadingWrapper {...loadingConfig}>{renderList(!loading)}</LoadingWrapper>
      <NavigationContainer fixed hideOnDesktop>
        <BackArrowButton id="backBtn" onClick={handleShowProject} />
        <PlusButton id="createDataSourceBtn" onClick={handleCreateDataSource} />
      </NavigationContainer>
    </Container>
  );
};

DataSourceList.propTypes = {
  userRole: PropTypes.string,
  createDataSource: PropTypes.func.isRequired,
  fetchDataSources: PropTypes.func.isRequired,
  cancelFetchListLoop: PropTypes.func.isRequired,
  dataSources: PropTypes.array.isRequired,
  uploadingDataSources: PropTypes.array.isRequired,
  copyDataSource: PropTypes.func.isRequired,
};
