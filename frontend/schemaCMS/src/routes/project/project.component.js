import React, { PureComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { List } from './list';
import { View } from './view';
import { DataSource } from './dataSource';

export class Project extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { match } = this.props;

    const listPath = `${match.path}/list`;
    const viewPath = `${match.path}/:id`;
    const dataSourcePath = `${viewPath}/datasource`;

    return (
      <Switch>
        <Redirect exact path={match.path} to={listPath} />

        <Route exact path={listPath} component={List} />
        <Route exact path={viewPath} component={View} />
        <Route path={dataSourcePath} component={DataSource} />
      </Switch>
    );
  }
}
