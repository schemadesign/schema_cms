import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';

import { Container } from './details.styles';

export class Details extends PureComponent {
  static propTypes = {};

  render() {
    return <Container>Details component</Container>;
  }
}
