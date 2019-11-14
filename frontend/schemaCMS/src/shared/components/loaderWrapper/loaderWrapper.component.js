import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';

import { Container } from './loaderWrapper.styles';

export class LoaderWrapper extends PureComponent {
  static propTypes = {};

  render() {
    return <Container>LoaderWrapper component</Container>;
  }
}
