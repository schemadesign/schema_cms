import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { path, pathEq } from 'ramda';
import { FormattedMessage } from 'react-intl';

import messages from './dataWranglingResult.messages';
import DataPreview from '../../../shared/components/dataPreview/dataPreview.component';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { SOURCE_PAGE } from '../../../modules/dataSource/dataSource.constants';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { getProjectMenuOptions } from '../../project/project.constants';

export class DataWranglingResult extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    previewData: PropTypes.object.isRequired,
    dataSource: PropTypes.object,
    fetchPreview: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
  };

  render() {
    const { dataSource, userRole } = this.props;
    const activeJobId = path(['activeJob', 'id'], dataSource);
    const headerTitle = dataSource.name;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
    const isFakeJob = pathEq(['activeJob', 'scripts'], [], dataSource);
    const menuOptions = getProjectMenuOptions(dataSource.project.id);

    if (isFakeJob) {
      this.props.history.push(`/datasource/${dataSource.id}/${SOURCE_PAGE}`);
      return null;
    }

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
        <DataPreview {...this.props} jobId={activeJobId} />
        <DataSourceNavigation {...this.props} hideOnDesktop />
      </Fragment>
    );
  }
}
