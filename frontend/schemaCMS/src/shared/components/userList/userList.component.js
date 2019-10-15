import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, Typography } from 'schemaUI';

import { Container } from './userList.styles';

const { H1 } = Typography;

export class UserList extends PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
  };

  renderList = (user, index) => (
    <Card key={index}>
      <H1>
        {user.firstName} {user.lastName}
      </H1>
    </Card>
  );

  render() {
    const { users } = this.props;
    return users.map(this.renderList);
  }
}
