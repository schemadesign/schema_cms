import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import messages from './loading.messages';

import { Container } from './loading.styles';

export class Loading extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <Container>
        <FormattedMessage {...messages.loading} />
      </Container>
    );
  }
}
