import React, { PureComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { View } from './view';
import { JobList } from './jobList';

const INITIAL_STEP = 1;

export default class DataSource extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const {
      match: { path },
    } = this.props;

    const viewPath = `${path}/:dataSourceId`;
    const viewPathWithStep = `${viewPath}/:step`;
    const jobListPath = `${path}/:dataSourceId/job`;

    return (
      <Switch>
        <Route exact path={jobListPath} component={JobList} />
        <Redirect exact path={viewPath} to={`${viewPath}/${INITIAL_STEP}`} />
        <Route exact path={viewPathWithStep} component={View} />
      </Switch>
    );
  }
}
