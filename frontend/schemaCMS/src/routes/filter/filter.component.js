import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import { List } from './list';
import { View } from './view';

export class Filter extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const {
      match: { path },
    } = this.props;

    const viewOnePath = `${path}/:fieldName`;
    return (
      <Switch>
        <Route exact path={path} component={List} />
        <Route exact path={viewOnePath} component={View} />
      </Switch>
    );
  }
}
