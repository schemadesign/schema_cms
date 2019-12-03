import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';

import { ComingSoon } from './dataSourceViews.styles';
import messages from './dataSourceViews.messages';
import { StepNavigation } from '../../../shared/components/stepNavigation';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';

export class DataSourceViews extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const headerTitle = this.props.dataSource.name;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <ComingSoon>
          <FormattedMessage {...messages.coming} />
        </ComingSoon>
        <StepNavigation {...this.props} />
      </Fragment>
    );
  }
}
