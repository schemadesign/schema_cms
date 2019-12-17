import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl, FormattedMessage } from 'react-intl';
import { compose } from 'ramda';
import queryString from 'query-string';

import messages from './notRegistered.messages';
import { TopHeader } from '../../shared/components/topHeader';
import { InfoContainer } from '../../shared/components/container/container.styles';

export class NotRegisteredComponent extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
  };

  getEmail() {
    const { search } = this.props.location;
    const { email } = queryString.parse(search);

    return email ? `(${email})` : '';
  }

  render() {
    const email = this.getEmail();

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader noProject />
        <InfoContainer>
          <FormattedMessage {...messages.info} values={{ email }} />
          <br />
          <FormattedMessage {...messages.contact} />
        </InfoContainer>
      </Fragment>
    );
  }
}

export const NotRegistered = compose(injectIntl)(NotRegisteredComponent);
