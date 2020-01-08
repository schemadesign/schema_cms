import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Typography } from 'schemaUI';

import messages from './notFound.messages';
import { InfoContainer } from '../../shared/components/container/container.styles';
import { TopHeader } from '../../shared/components/topHeader';

const { H1 } = Typography;

export class NotFound extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  };

  render() {
    const title = <FormattedMessage {...messages.title} />;
    const subTitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader headerTitle={title} headerSubtitle={subTitle} isAdmin={this.props.isAdmin} />
        <InfoContainer>
          <H1>
            <FormattedMessage {...messages.description} />
          </H1>
        </InfoContainer>
      </Fragment>
    );
  }
}
