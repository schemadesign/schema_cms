import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl, FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { compose } from 'ramda';

import messages from './notRegistered.messages';
import { InfoContainer } from '../../shared/components/container/container.styles';
import { getQueryParams } from '../../shared/utils/helpers';
import { TopHeader } from '../../shared/components/topHeader';

export class NotRegisteredComponent extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
  };

  render() {
    const { email } = getQueryParams(this.props);
    const title = <FormattedMessage {...messages.title} />;
    const subTitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader headerTitle={title} headerSubtitle={subTitle} iconComponent={null} />

        <InfoContainer>
          <FormattedHTMLMessage {...messages.info} values={{ email }} />
          <br />
          <FormattedHTMLMessage {...messages.contact} />
        </InfoContainer>
      </Fragment>
    );
  }
}

export const NotRegistered = compose(injectIntl)(NotRegisteredComponent);
