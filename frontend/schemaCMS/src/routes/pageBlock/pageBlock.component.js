import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container } from './pageBlock.styles';

export class PageBlock extends PureComponent {
  static propTypes = {};

  render() {
    return <Container>PageBlock component</Container>;
  }
}
