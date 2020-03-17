import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';

import { NotFound } from '../notFound';
import { PageList } from './pageList';

export const Section = () => {
  const { path } = useRouteMatch();
  const sectionPath = `${path}/:sectionId`;

  return (
    <Switch>
      <Route exact path={sectionPath} component={PageList} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};
