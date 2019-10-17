import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';

import { Container, UserItem } from './addUser.styles';
import { PlusButton } from '../../../shared/components/navigation';

export class AddUser extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    fetchNotInProjectUsers: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
  };

  componentDidMount() {
    this.props.fetchNotInProjectUsers(path(['match', 'params', 'projectId'], this.props));
  }

  renderUser = (user, index) => (
    <UserItem key={index}>
      {`${user.firstName} ${user.lastName}`}
      <PlusButton id={`addUserPlusButton${index}`} onClick={this.handleAddUser} />
    </UserItem>
  );

  render() {
    const { users } = this.props;

    return <Container>{users.map(this.renderUser)}</Container>;
  }
}
