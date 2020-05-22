import React, { PureComponent, Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { always, pathEq, pathOr } from 'ramda';

import { CreateFilter } from './createFilter';
import { Source } from './source';
import { JobList } from './jobList';
import { Filters } from './filters';
import { Fields } from './fields';
import { DataWranglingScripts } from './dataWranglingScripts';
import { DataWranglingResult } from './dataWranglingResult';
import { DataSourceTags } from './dataSourceTags';
import { renderWhenTrueOtherwise } from '../../shared/utils/rendering';
import { SOURCES } from '../../shared/components/projectTabs/projectTabs.constants';
import { ProjectTabs } from '../../shared/components/projectTabs';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { getMatchParam } from '../../shared/utils/helpers';
import reportError from '../../shared/utils/reportError';
import { NotFound } from '../notFound';
import {
  FILTERS_PAGE,
  PREVIEW_PAGE,
  RESULT_PAGE,
  STEPS_PAGE,
  TAGS_PAGE,
  STATES_PAGE,
} from '../../modules/dataSource/dataSource.constants';
import { DataSourceStateList } from './dataSourceStateList';
import { CreateDataSourceState } from './createDataSourceState';

export default class DataSource extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object.isRequired,
    fetchDataSource: PropTypes.func.isRequired,
    fetchProject: PropTypes.func.isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');

      await this.props.fetchDataSource({ dataSourceId });
      await this.props.fetchProject({ projectId: this.props.dataSource.project.id });
    } catch (error) {
      reportError(error);
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  renderRestDataSourceSteps = ({ path, hasActiveJob }) =>
    renderWhenTrueOtherwise(
      always(<Redirect path={path} to={`${path}/source`} />),
      always(
        <Switch>
          <Route exact path={`${path}/${PREVIEW_PAGE}`} component={Fields} />
          <Route exact path={`${path}/${STEPS_PAGE}`} component={DataWranglingScripts} />
          <Route exact path={`${path}/${FILTERS_PAGE}/add`} component={CreateFilter} />
          <Route exact path={`${path}/${FILTERS_PAGE}`} component={Filters} />
          <Route exact path={`${path}/${RESULT_PAGE}`} component={DataWranglingResult} />
          <Route exact path={`${path}/${TAGS_PAGE}`} component={DataSourceTags} />
          <Route exact path={`${path}/${STATES_PAGE}/create`} component={CreateDataSourceState} />
          <Route exact path={`${path}/${STATES_PAGE}`} component={DataSourceStateList} />
          <Route exact path={`${path}/*`} component={NotFound} />
        </Switch>
      )
    )(hasActiveJob);

  render() {
    const { loading, error } = this.state;
    const {
      match: { path },
      dataSource,
    } = this.props;
    const sourcePath = `${path}/source`;
    const jobListPath = `${path}/job`;
    const hasActiveJob = pathEq(['dataSource', 'activeJob'], null, this.props);
    const projectId = pathOr('', ['project', 'id'], dataSource);

    return (
      <Fragment>
        <ProjectTabs active={SOURCES} url={`/project/${projectId}`} />
        <LoadingWrapper loading={loading} error={error}>
          <Switch>
            <Redirect exact path={path} to={sourcePath} />
            <Route exact path={sourcePath} component={Source} />
            <Route exact path={jobListPath} component={JobList} />
            {this.renderRestDataSourceSteps({ path, hasActiveJob })}
          </Switch>
        </LoadingWrapper>
      </Fragment>
    );
  }
}
