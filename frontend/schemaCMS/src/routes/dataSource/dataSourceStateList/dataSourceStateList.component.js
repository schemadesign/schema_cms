import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { Icons } from 'schemaUI';
import { useHistory, useParams, useRouteMatch } from 'react-router';
import { useEffectOnce } from 'react-use';

import { Container, ListContainer, ListItem, StateName } from './dataSourceStateList.styles';
import messages from './dataSourceStateList.messages';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions } from '../../project/project.constants';
import { CounterHeader } from '../../../shared/components/counterHeader';
import { mobilePlusStyles, PlusContainer } from '../../../shared/components/form/frequentComponents.styles';
import { PlusButton } from '../../../shared/components/navigation';

const { EditIcon } = Icons;

export const DataSourceStateList = ({ states, dataSource, userRole, project, fetchStates }) => {
  const { dataSourceId } = useParams();
  const match = useRouteMatch();
  const history = useHistory();
  const intl = useIntl();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchStates({ dataSourceId });
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  const handleCreateState = () => history.push(`/datasource/${dataSourceId}/state/create`);
  const handleShowState = id => history.push(`/state/${id}`);

  const renderState = (item, index) => (
    <ListItem key={index} onClick={() => handleShowState(item.id)}>
      <StateName title={item.name}>{item.name}</StateName>
      <EditIcon />
    </ListItem>
  );

  const renderList = list => <ListContainer>{list.map(renderState)}</ListContainer>;

  const headerTitle = <FormattedMessage {...messages.title} />;
  const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
  const menuOptions = getProjectMenuOptions(project.id);
  const stateCopy = intl.formatMessage(messages.state);

  return (
    <Container>
      <Helmet title={intl.formatMessage(messages.title)} />
      <MobileMenu
        headerTitle={headerTitle}
        headerSubtitle={headerSubtitle}
        options={filterMenuOptions(menuOptions, userRole)}
      />
      <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
        <DataSourceNavigation history={history} match={match} dataSource={dataSource} />
      </ContextHeader>
      <CounterHeader
        count={states.length}
        copy={stateCopy}
        right={
          <PlusContainer>
            <PlusButton
              id="createStateDesktopBtn"
              customStyles={mobilePlusStyles}
              onClick={handleCreateState}
              type="button"
            />
          </PlusContainer>
        }
      />
      <LoadingWrapper
        loading={loading}
        error={error}
        noData={!states.length}
        noDataContent={<FormattedMessage {...messages.noData} />}
      >
        {renderList(states)}
      </LoadingWrapper>
      <DataSourceNavigation hideOnDesktop history={history} match={match} dataSource={dataSource} />
    </Container>
  );
};

DataSourceStateList.propTypes = {
  userRole: PropTypes.string.isRequired,
  states: PropTypes.array.isRequired,
  fetchStates: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  dataSource: PropTypes.object.isRequired,
};
