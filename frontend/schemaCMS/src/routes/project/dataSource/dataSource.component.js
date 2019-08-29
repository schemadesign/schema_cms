import React, { PureComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Create } from './create';
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
    const createPath = `${match.path}/create`;

    return (
      <Switch>
        <Redirect exact path={match.path} to={listPath} />

        <Route exact path={listPath} component={List} />
        <Route exact path={createPath} component={Create} />
      </Switch>
    );
  }
}
