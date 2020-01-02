import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import messages from './fields.messages';
import DataPreview from '../../../shared/components/dataPreview/dataPreview.component';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';

export class Fields extends PureComponent {
  static propTypes = {
    previewData: PropTypes.object.isRequired,
    fetchPreview: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    dataSource: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  render() {
    const headerTitle = this.props.dataSource.name;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          projectId={this.props.dataSource.project.id}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <DataSourceNavigation {...this.props} />
        </ContextHeader>
        <DataPreview {...this.props} />
        <DataSourceNavigation {...this.props} hideOnDesktop />
      </Fragment>
    );
  }
}
