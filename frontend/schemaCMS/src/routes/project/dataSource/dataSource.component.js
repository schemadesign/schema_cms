import React, { PureComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { View } from './view';
import { List } from './list';

export class DataSource extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { match } = this.props;
    const listPath = `${match.path}/list`;
    const viewPath = `${match.path}/:dataSourceId`;

    return (
      <Switch>
        <Redirect exact path={match.path} to={listPath} />

        <Route exact path={listPath} component={List} />
        <Route exact path={viewPath} component={View} />
      </Switch>
    );
  }
}
