import React, { PureComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { View } from './view';
import { List } from './list';
import { View as DataWranglingView } from './view/dataWrangling/view';

const INITIAL_STEP = 1;

export class DataSource extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { match } = this.props;
    const listPath = `${match.path}/list`;
    const viewPath = `${match.path}/view/:dataSourceId`;
    const viewPathWithStep = `${viewPath}/:step`;
    const scriptPath = `${viewPath}/script/view/:id`;

    return (
      <Switch>
        <Redirect exact path={match.path} to={listPath} />
        <Redirect exact path={viewPath} to={`${viewPath}/${INITIAL_STEP}`} />

        <Route exact path={listPath} component={List} />
        <Route exact path={viewPathWithStep} component={View} />

        <Route exact path={scriptPath} component={DataWranglingView} />
      </Switch>
    );
  }
}
