import React, { PureComponent } from 'react';

import { Container } from './view.styles';

export class View extends PureComponent {
  static propTypes = {};

  render() {
    return <Container>View component</Container>;
  }
}
