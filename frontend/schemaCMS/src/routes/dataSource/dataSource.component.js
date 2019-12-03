import React, { PureComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { CreateFilter } from './createFilter';
import { Source } from './source';
import { JobList } from './jobList';
import { Filters } from './filters';
import { Fields } from './fields';
import { DataWranglingScripts } from './dataWranglingScripts';
import { DataWranglingResult } from '../dataWranglingResult';
import { DataSourceViews } from './dataSourceViews';
import { renderWhenTrue } from '../../shared/utils/rendering';

export default class DataSource extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object.isRequired,
    fetchDataSource: PropTypes.func.isRequired,
    unmountDataSource: PropTypes.func.isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    if (!this.props.dataSource.id) {
      const { dataSourceId } = this.props.match.params;

      await this.props.fetchDataSource({ dataSourceId });
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    this.props.unmountDataSource();
  }

  renderRouting = renderWhenTrue(() => {
    const {
      match: { path },
    } = this.props;
    const sourcePath = `${path}/source`;
    const previewPath = `${path}/preview`;
    const jobListPath = `${path}/job`;
    const filtersPath = `${path}/filters`;
    const addFilterPath = `${path}/filters/add`;
    const resultPath = `${path}/result`;
    const stepsPath = `${path}/steps`;
    const viewsPath = `${path}/views`;

    return (
      <Switch>
        <Route exact path={jobListPath} component={JobList} />
        <Redirect exact path={path} to={sourcePath} />
        <Route exact path={sourcePath} component={Source} />
        <Route exact path={previewPath} component={Fields} />
        <Route exact path={stepsPath} component={DataWranglingScripts} />
        <Route exact path={addFilterPath} component={CreateFilter} />
        <Route exact path={filtersPath} component={Filters} />
        <Route exact path={resultPath} component={DataWranglingResult} />
        <Route exact path={viewsPath} component={DataSourceViews} />
      </Switch>
    );
  });

  render() {
    return this.renderRouting(!this.state.loading);
  }
}
