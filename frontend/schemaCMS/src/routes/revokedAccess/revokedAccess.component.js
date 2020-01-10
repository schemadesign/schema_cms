import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { compose } from 'ramda';

import messages from './revokedAccess.messages';
import { InfoContainer } from '../../shared/components/container/container.styles';
import { getQueryParams } from '../../shared/utils/helpers';

export class RevokedAccessComponent extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
  };

  render() {
    const { email } = getQueryParams(this.props);

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <InfoContainer>
          <FormattedHTMLMessage {...messages.info} values={{ email }} />
          <br />
          <FormattedHTMLMessage {...messages.contact} />
        </InfoContainer>
      </Fragment>
    );
  }
}

export const RevokedAccess = compose(injectIntl)(RevokedAccessComponent);