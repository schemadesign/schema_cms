import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container } from './logout.styles';

export class Logout extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <Container>Logout component</Container>
    );
  }
}
