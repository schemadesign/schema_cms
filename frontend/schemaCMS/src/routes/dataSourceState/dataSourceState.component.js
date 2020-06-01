import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useRouteMatch } from 'react-router';

import { StateFilter } from './stateFilter';
import { EditState } from './editState';
import { NotFound } from '../notFound';

export const DataSourceState = () => {
  const { path } = useRouteMatch();
  const filterPath = `${path}/filter/:filterId`;
  const statePath = `${path}/:stateId`;

  return (
    <Switch>
      <Route exact path={filterPath} component={StateFilter} />
      <Route exact path={statePath} component={EditState} />
      <Route exact path={`${path}/*`} component={NotFound} />
    </Switch>
  );
};

DataSourceState.propTypes = {};
