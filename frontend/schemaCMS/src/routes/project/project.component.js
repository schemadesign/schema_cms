import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { List } from './list';
import { View } from './view';
import { UserDetails } from './userDetails';
import { Create } from './create';
import { DataSourceList } from './dataSourceList';
import UserList from './userList/userList.container';
import { AddUser } from './addUser';
import { CreateDataSource } from './createDataSource';
import { FolderList } from './folderList';
import { CreateFolder } from './createFolder';
import { NotFound } from '../notFound';

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
    const usersPath = `${viewPath}/user`;
    const userPath = `${usersPath}/:userId`;
    const addUserList = `${usersPath}/add`;
    const dataSourceListPath = `${viewPath}/datasource`;
    const createDataSourcePath = `${dataSourceListPath}/add`;
    const folderListPath = `${viewPath}/folder`;
    const folderCreatePath = `${viewPath}/folder/create`;

    return (
      <Switch>
        <Route exact path={createDataSourcePath} component={CreateDataSource} />
        <Route exact path={createPath} component={Create} />
        <Route exact path={path} component={List} />
        <Route exact path={dataSourceListPath} component={DataSourceList} />
        <Route exact path={viewPath} component={View} />
        <Route exact path={usersPath} component={UserList} />
        <Route exact path={addUserList} component={AddUser} />
        <Route exact path={userPath} component={UserDetails} />
        <Route exact path={folderListPath} component={FolderList} />
        <Route exact path={folderCreatePath} component={CreateFolder} />
        <Route path="*" component={NotFound} />
      </Switch>
    );
  }
}
