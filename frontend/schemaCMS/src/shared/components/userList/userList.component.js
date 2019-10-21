import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, Typography } from 'schemaUI';
import { Link } from 'react-router-dom';

const { H1, H3 } = Typography;

export class UserList extends PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
  };

  renderList = (user, index) => (
    <Card key={index}>
      <H1>
        <Link to={`/user/${user.id}`}>
          {user.firstName} {user.lastName}
        </Link>
      </H1>
      <H3 style={{ marginTop: '10px' }}>{user.email}</H3>
    </Card>
  );

  render() {
    const { users } = this.props;
    return users.map(this.renderList);
  }
}
