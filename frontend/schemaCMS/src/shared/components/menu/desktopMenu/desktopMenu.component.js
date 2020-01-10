import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';

import { Container } from './desktopMenu.styles';

export class DesktopMenu extends PureComponent {
  static propTypes = {
    options: PropTypes.array.isRequired,
  };

  render() {
    return <Container>DesktopMenu component</Container>;
  }
}
