import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Typography } from 'schemaUI';

import messages from './notFound.messages';
import { InfoContainer } from '../../shared/components/container/container.styles';
import { MobileMenu } from '../../shared/components/menu/mobileMenu';

const { H1 } = Typography;

export class NotFound extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  };

  render() {
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <MobileMenu headerTitle={headerTitle} headerSubtitle={headerSubtitle} isAdmin={this.props.isAdmin} />
        <InfoContainer>
          <H1>
            <FormattedMessage {...messages.description} />
          </H1>
        </InfoContainer>
      </Fragment>
    );
  }
}
