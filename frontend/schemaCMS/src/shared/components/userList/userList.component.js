import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, Typography, Button, Icons } from 'schemaUI';
import { Link } from 'react-router-dom';

import { renderWhenTrue } from '../../utils/rendering';

import { Actions, buttonIconStyles, iconStyles } from './userList.styles';

const { H1, H3 } = Typography;
const { CloseIcon } = Icons;

export class UserList extends PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
    onRemoveUser: PropTypes.func,
  };

  renderRemove = renderWhenTrue((_, user) => (
    <Button customStyles={buttonIconStyles} onClick={this.props.onRemoveUser(user)}>
      <CloseIcon customStyles={iconStyles} />
    </Button>
  ));

  renderListItem = (user, hasRemoving, index) => (
    <Card key={index}>
      <H1>
        <Link to={`/user/${user.id}`}>
          {user.firstName} {user.lastName}
        </Link>
      </H1>
      <H3 style={{ marginTop: '10px' }}>{user.email}</H3>
      <Actions>{this.renderRemove(!!this.props.onRemoveUser, user)}</Actions>
    </Card>
  );

  render() {
    const { users, onRemoveUser } = this.props;
    const hasRemoving = !!onRemoveUser;

    return users.map((user, index) => this.renderListItem(user, hasRemoving, index));
  }
}
