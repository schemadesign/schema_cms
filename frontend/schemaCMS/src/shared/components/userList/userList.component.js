import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icons } from 'schemaUI';
import { ifElse, is } from 'ramda';

import { renderWhenTrue } from '../../utils/rendering';
import {
  Actions,
  UserDetails,
  UserFullName,
  Email,
  buttonIconStyles,
  iconStyles,
  cardStyles,
  ListItemContent,
} from './userList.styles';

import { ListItem, ListContainer } from '../listComponents';

const { CloseIcon } = Icons;

export class UserList extends PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    projectId: PropTypes.string,
    onRemoveUser: PropTypes.func,
  };

  getUrl = ifElse(is(String), projectId => `/project/${projectId}/user/`, () => '/user/');

  renderRemove = renderWhenTrue((_, user) => (
    <Button customStyles={buttonIconStyles} onClick={this.props.onRemoveUser(user)}>
      <CloseIcon customStyles={iconStyles} />
    </Button>
  ));

  renderListItem = ({ user, hasRemoving, isAdmin, index }) => (
    <ListItem key={index} customStyles={cardStyles}>
      <ListItemContent>
        <UserDetails>
          <UserFullName to={`${this.getUrl(this.props.projectId)}${user.id}`}>
            {user.firstName} {user.lastName}
          </UserFullName>
          <Email>{user.email}</Email>
        </UserDetails>
        <Actions>{this.renderRemove(hasRemoving && isAdmin, user)}</Actions>
      </ListItemContent>
    </ListItem>
  );

  render() {
    const { users, onRemoveUser, isAdmin } = this.props;
    const hasRemoving = !!onRemoveUser;

    return (
      <ListContainer>
        {users.map((user, index) => this.renderListItem({ user, hasRemoving, isAdmin, index }))}
      </ListContainer>
    );
  }
}
