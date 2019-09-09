import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Container } from './resetPassword.styles';
import messages from './resetPassword.messages';

export class ResetPassword extends PureComponent {
  static propTypes = {
    resetPassword: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.resetPassword();
  }

  render() {
    return (
      <Container>
        <FormattedMessage {...messages.validate} />
      </Container>
    );
  }
}
