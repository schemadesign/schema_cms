import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, Typography } from 'schemaUI';

const { H1 } = Typography;

export class List extends PureComponent {
  static propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
  };

  componentDidMount() {
    this.props.fetchUsers();
  }

  renderUsers = (user, index) => (
    <Card key={index}>
      <H1>
        {user.firstName} {user.lastName}
      </H1>
    </Card>
  );

  render() {
    const { users } = this.props;
    return users.map(this.renderUsers);
  }
}
