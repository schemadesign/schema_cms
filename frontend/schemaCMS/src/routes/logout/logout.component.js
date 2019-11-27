import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Container } from './logout.styles';
import messages from './logout.messages';

export class Logout extends PureComponent {
  static propTypes = {
    logout: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.logout();
  }

  render() {
    return (
      <Container>
        <FormattedMessage {...messages.loggingOut} />
      </Container>
    );
  }
}
