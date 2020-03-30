import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';

import { ComingSoon } from './dataSourceViews.styles';
import messages from './dataSourceViews.messages';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { getProjectMenuOptions } from '../../project/project.constants';

export class DataSourceViews extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    dataSource: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { dataSource, userRole } = this.props;
    const headerTitle = dataSource.name;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
    const menuOptions = getProjectMenuOptions(dataSource.project.id);

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <DataSourceNavigation {...this.props} />
        </ContextHeader>
        <ComingSoon>
          <FormattedMessage {...messages.coming} />
        </ComingSoon>
        <DataSourceNavigation {...this.props} hideOnDesktop />
      </Fragment>
    );
  }
}
