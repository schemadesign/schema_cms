import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'ramda';

import messages from './notRegistered.messages';
import { InfoContainer } from '../../shared/components/container/container.styles';
import { getQueryParams } from '../../shared/utils/helpers';
import { MobileMenu } from '../../shared/components/menu/mobileMenu';

export class NotRegisteredComponent extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
  };

  render() {
    const { email } = getQueryParams(this.props);
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <MobileMenu headerTitle={headerTitle} headerSubtitle={headerSubtitle} iconComponent={null} />

        <InfoContainer>
          <FormattedMessage {...messages.info} values={{ email, b: msg => <b>{msg}</b> }} />
          <br />
          <FormattedMessage {...messages.contact} values={{ a: msg => <a href="/">{msg}</a> }} />
        </InfoContainer>
      </Fragment>
    );
  }
}

export const NotRegistered = compose(injectIntl)(NotRegisteredComponent);
