import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container } from './view.styles';

export class View extends PureComponent {
  static propTypes = {};

  render() {
    return <Container>View component</Container>;
  }
}
