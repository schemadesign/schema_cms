import { PureComponent } from 'react';
import PropTypes from 'prop-types';

export class Logout extends PureComponent {
  static propTypes = {
    logout: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.logout();
  }

  render() {
    return null;
  }
}
