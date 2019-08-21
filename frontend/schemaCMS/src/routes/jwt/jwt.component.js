import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export class Jwt extends PureComponent {
  static propTypes = {
    getJwtToken: PropTypes.func.isRequired,
    location: PropTypes.object,
  };

  componentDidMount() {
    const { location, getJwtToken } = this.props;

    if (location.state && location.state.token && location.state.user) {
      return getJwtToken(location.state.user, location.state.token);
    }
  }

  render() {
    return <div>Validating</div>;
  }
}
