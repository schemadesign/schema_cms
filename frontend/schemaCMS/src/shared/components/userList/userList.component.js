import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';

import { Container } from './userList.styles';

export class UserList extends PureComponent {
  static propTypes = {};

  render() {
    return <Container>UserList component</Container>;
  }
}
