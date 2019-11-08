import React, { PureComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { View } from './view';
import { FILTERS_STEP } from '../../modules/dataSource/dataSource.constants';
import { CreateFilter } from './view/createFilter';
import { JobList } from './jobList';

const INITIAL_STEP = 1;

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

  componentDidMount() {
    if (!this.props.dataSource.id) {
      const { dataSourceId } = this.props.match.params;

      this.props.fetchDataSource({ dataSourceId });
    }
  }

  componentWillUnmount() {
    this.props.unmountDataSource();
  }

  render() {
    const {
      match: { path },
    } = this.props;
    const viewPathWithStep = `${path}/:step`;
    const pathAddFilter = `${path}/${FILTERS_STEP}/add`;
    const jobListPath = `${path}/job`;

    return (
      <Switch>
        <Route exact path={jobListPath} component={JobList} />
        <Redirect exact path={path} to={`${path}/${INITIAL_STEP}`} />
        <Route exact path={viewPathWithStep} component={View} />
        <Route exact path={pathAddFilter} component={CreateFilter} />
      </Switch>
    );
  }
}
