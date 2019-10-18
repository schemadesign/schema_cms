import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import UserProfile from '../../shared/components/userProfile';

export class Settings extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    userData: PropTypes.object.isRequired,
    updateMe: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  };

  render() {
    return <UserProfile {...this.props} />;
  }
}
