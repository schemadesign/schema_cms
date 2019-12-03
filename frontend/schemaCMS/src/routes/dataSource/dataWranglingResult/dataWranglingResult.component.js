import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { path } from 'ramda';
import { FormattedMessage } from 'react-intl';

import messages from './dataWranglingResult.messages';
import DataPreview from '../../../shared/components/dataPreview/dataPreview.component';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';

export class DataWranglingResult extends PureComponent {
  static propTypes = {
    previewData: PropTypes.object.isRequired,
    dataSource: PropTypes.object,
    fetchPreview: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
  };

  getActiveJobId = () => path(['dataSource', 'activeJob', 'id'], this.props);

  render() {
    const activeJobId = this.getActiveJobId(this.props);
    const headerTitle = this.props.dataSource.name;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <DataSourceNavigation {...this.props} />
        </ContextHeader>
        <DataPreview {...this.props} jobId={activeJobId} />
        <DataSourceNavigation {...this.props} hideOnDesktop />
      </Fragment>
    );
  }
}
