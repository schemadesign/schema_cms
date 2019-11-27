import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Container } from './jwt.styles';
import messages from './jwt.messages';

export class Jwt extends PureComponent {
  static propTypes = {
    getJwtToken: PropTypes.func.isRequired,
    location: PropTypes.object,
  };

  componentDidMount() {
    const { location, getJwtToken } = this.props;

    if (location.state && location.state.token && location.state.user) {
      getJwtToken(location.state.user, location.state.token);
    }
  }

  render() {
    return (
      <Container>
        <FormattedMessage {...messages.validating} />
      </Container>
    );
  }
}
