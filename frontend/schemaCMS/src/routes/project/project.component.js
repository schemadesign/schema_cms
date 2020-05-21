import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';

import { View } from './view';
import { UserDetails } from './userDetails';
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
import { CreateTagCategory } from './createTagCategory';
import reportError from '../../shared/utils/reportError';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';

export class Project extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      params: PropTypes.object.isRequired,
    }).isRequired,
    fetchProject: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const { params } = this.props.match;
      if (params.projectId) {
        await this.props.fetchProject(params);
      }
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  render() {
    const { match, project } = this.props;
    const { error, loading } = this.state;
    const { path } = match;

    const usersPath = `${path}/user`;
    const userPath = `${usersPath}/:userId`;
    const addUserList = `${usersPath}/add`;
    const dataSourceListPath = `${path}/datasource`;
    const createDataSourcePath = `${dataSourceListPath}/add`;
    const contentPath = `${path}/content`;
    const stateListPath = `${path}/state`;
    const stateCreatePath = `${path}/state/create`;
    const templatesPath = `${path}/templates`;
    const blockTemplatesPath = `${path}/block-templates`;
    const createBlockTemplatePath = `${blockTemplatesPath}/create`;
    const pageTemplatesPath = `${path}/page-templates`;
    const createPageTemplatePath = `${path}/page-templates/create`;
    const createSectionPath = `${path}/section/create`;
    const tagCategoriesPath = `${path}/tag-categories`;
    const createTagCategoriesPath = `${tagCategoriesPath}/create`;

    return (
      <LoadingWrapper loading={loading} noData={isEmpty(project)} error={error}>
        {() =>
          project.id ? (
            <Switch>
              <Route exact path={createDataSourcePath} component={CreateDataSource} />
              <Route exact path={dataSourceListPath} component={DataSourceList} />
              <Route exact path={path} component={View} />
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
              <Route exact path={createTagCategoriesPath} component={CreateTagCategory} />
              <Route path="*" component={NotFound} />
            </Switch>
          ) : null
        }
      </LoadingWrapper>
    );
  }
}
