import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useHistory, useRouteMatch } from 'react-router';

import { Container } from './metadata.styles';
import messages from './metadata.messages';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { getProjectMenuOptions } from '../../project/project.constants';

export const Metadata = ({ dataSource, userRole, project }) => {
  const intl = useIntl();
  const history = useHistory();
  const match = useRouteMatch();
  const headerTitle = dataSource.name;
  const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
  const menuOptions = getProjectMenuOptions(project.id);

  return (
    <Container>
      <Helmet title={intl.formatMessage(messages.pageTitle)} />
      <MobileMenu
        headerTitle={headerTitle}
        headerSubtitle={headerSubtitle}
        options={filterMenuOptions(menuOptions, userRole)}
      />
      <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
        <DataSourceNavigation history={history} match={match} dataSource={dataSource} />
      </ContextHeader>
    </Container>
  );
};

Metadata.propTypes = {
  dataSource: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
};
