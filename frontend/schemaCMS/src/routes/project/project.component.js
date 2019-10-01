import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { List } from './list';
import { View } from './view';
import { Create } from './create';
import { DataSourceList } from './dataSourceList';

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

    return (
      <Switch>
        <Route exact path={createPath} component={Create} />
        <Route exact path={path} component={List} />
        <Route exact path={dataSourceListPath} component={DataSourceList} />
        <Route exact path={viewPath} component={View} />
      </Switch>
    );
  }
}
