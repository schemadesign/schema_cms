import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl, FormattedMessage } from 'react-intl';
import { compose } from 'ramda';
import { Typography } from 'schemaUI';

import messages from './notFound.messages';
import { NoData } from '../../shared/components/noData';

const { H1 } = Typography;

export class NotFoundComponent extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />

        <NoData>
          <H1>
            <FormattedMessage {...messages.title} />
          </H1>
        </NoData>
      </Fragment>
    );
  }
}

export const NotFound = compose(injectIntl)(NotFoundComponent);
