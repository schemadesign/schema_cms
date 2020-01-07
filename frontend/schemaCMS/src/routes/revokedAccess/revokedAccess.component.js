import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { compose } from 'ramda';
import queryString from 'query-string';

import messages from './revokedAccess.messages';
import { InfoContainer } from '../../shared/components/container/container.styles';

export class RevokedAccessComponent extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
  };

  getEmail() {
    const { search } = this.props.location;
    const { email } = queryString.parse(search);

    return email ? `${email}` : '';
  }

  render() {
    const email = this.getEmail();

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <InfoContainer>
          <FormattedHTMLMessage {...messages.info} values={{ email }} />
          <br />
          <FormattedMessage {...messages.contact} />
        </InfoContainer>
      </Fragment>
    );
  }
}

export const RevokedAccess = compose(injectIntl)(RevokedAccessComponent);
