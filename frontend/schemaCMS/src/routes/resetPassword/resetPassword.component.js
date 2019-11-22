import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Container } from './resetPassword.styles';
import messages from './resetPassword.messages';
import { AUTH_METHODS } from '../../modules/userProfile/userProfile.constants';

export class ResetPassword extends PureComponent {
  static propTypes = {
    resetPassword: PropTypes.func.isRequired,
    userData: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
  };

  componentDidMount() {
    if (this.props.userData.authMethod === AUTH_METHODS.EMAIL) {
      return this.props.resetPassword();
    }

    return this.props.history.push('/settings');
  }

  render() {
    return (
      <Container>
        <FormattedMessage {...messages.validate} />
      </Container>
    );
  }
}
