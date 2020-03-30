import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icons } from 'schemaUI';
import { ifElse, is } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { renderWhenTrue } from '../../utils/rendering';
import {
  buttonIconStyles,
  cardStyles,
  ListItem,
  ListItemContent,
  Role,
  UserDetails,
  UserFullName,
} from './userList.styles';
import messages from './userList.messages';

import { ListContainer } from '../listComponents';

const { EditIcon } = Icons;

export class UserList extends PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool,
    projectId: PropTypes.string,
  };

  getUrl = ifElse(
    is(String),
    projectId => `/project/${projectId}/user/`,
    () => '/user/'
  );

  renderEdit = renderWhenTrue(() => (
    <Button customStyles={buttonIconStyles}>
      <EditIcon />
    </Button>
  ));

  renderRole = role =>
    renderWhenTrue(() => (
      <Role>
        <FormattedMessage {...messages[role]} />
      </Role>
    ))(!!messages[role]);

  renderHeader = ({ role }, isAdmin) => (
    <Fragment>
      {this.renderRole(role)}
      {this.renderEdit(isAdmin)}
    </Fragment>
  );

  renderListItem = ({ user, isAdmin, index }) => {
    const header = this.renderHeader(user, isAdmin);

    return (
      <ListItem key={index} customStyles={cardStyles} headerComponent={header}>
        <ListItemContent>
          <UserDetails>
            <UserFullName to={`${this.getUrl(this.props.projectId)}${user.id}`}>
              {user.firstName} {user.lastName}
            </UserFullName>
          </UserDetails>
        </ListItemContent>
      </ListItem>
    );
  };

  render() {
    const { users, isAdmin } = this.props;

    return <ListContainer>{users.map((user, index) => this.renderListItem({ user, isAdmin, index }))}</ListContainer>;
  }
}
