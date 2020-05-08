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
import { Content } from './content';
import { NotFound } from '../notFound';
import { ProjectStateList } from './projectStateList';
import { CreateProjectState } from './createProjectState';
import { Templates } from './templates';
import { BlockTemplates } from './blockTemplates';
import { CreateBlockTemplate } from './createBlockTemplate';
import { PageTemplates } from './pageTemplates';
import { CreatePageTemplate } from './createPageTemplate';
import { CreateSection } from './createSection';
import { TagCategories } from './tagCategories';
import { CreateProjectTag } from './createProjectTag';

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
    const contentPath = `${viewPath}/content`;
    const stateListPath = `${viewPath}/state`;
    const stateCreatePath = `${viewPath}/state/create`;
    const templatesPath = `${viewPath}/templates`;
    const blockTemplatesPath = `${viewPath}/block-templates`;
    const createBlockTemplatePath = `${blockTemplatesPath}/create`;
    const pageTemplatesPath = `${viewPath}/page-templates`;
    const createPageTemplatePath = `${viewPath}/page-templates/create`;
    const createSectionPath = `${viewPath}/section/create`;
    const tagCategoriesPath = `${viewPath}/tag-categories`;
    const createTagCategoriesPath = `${tagCategoriesPath}/create`;

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
        <Route exact path={contentPath} component={Content} />
        <Route exact path={stateListPath} component={ProjectStateList} />
        <Route exact path={stateCreatePath} component={CreateProjectState} />
        <Route exact path={templatesPath} component={Templates} />
        <Route exact path={blockTemplatesPath} component={BlockTemplates} />
        <Route exact path={createBlockTemplatePath} component={CreateBlockTemplate} />
        <Route exact path={pageTemplatesPath} component={PageTemplates} />
        <Route exact path={createPageTemplatePath} component={CreatePageTemplate} />
        <Route exact path={createSectionPath} component={CreateSection} />
        <Route exact path={tagCategoriesPath} component={TagCategories} />
        <Route exact path={createTagCategoriesPath} component={CreateProjectTag} />
        <Route path="*" component={NotFound} />
      </Switch>
    );
  }
}
