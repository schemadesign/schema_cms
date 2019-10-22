import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { List } from './list';
import { View } from './view';
import User from '../user/view/view.container';
import { Create } from './create';
import { DataSourceList } from './dataSourceList';
import UserList from './userList/userList.container';
import { AddUser } from './addUser';

export class Project extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { match } = this.props;
    const { path } = match;

    const viewPath = `${path}/:projectId`;
    const createPath = `${path}/create/`;
    const dataSourceListPath = `${path}/:projectId/datasource/`;
    const usersPath = `${path}/:projectId/user`;
    const userPath = `${path}/:projectId/user/:userId`;
    const addUserList = `${userPath}/add`;

    return (
      <Switch>
        <Route exact path={createPath} component={Create} />
        <Route exact path={path} component={List} />
        <Route exact path={dataSourceListPath} component={DataSourceList} />
        <Route exact path={viewPath} component={View} />
        <Route exact path={usersPath} component={UserList} />
        <Route exact path={userPath} component={User} />
        <Route exact path={addUserList} component={AddUser} />
      </Switch>
    );
  }
}
