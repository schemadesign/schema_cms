import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';

import { NotFound } from '../notFound';
import { PageList } from './pageList';
import { CreatePage } from './createPage';

export const Section = () => {
  const { path } = useRouteMatch();
  const sectionPath = `${path}/:sectionId`;
  const createPagePath = `${sectionPath}/create-page`;

  return (
    <Switch>
      <Route exact path={sectionPath} component={PageList} />
      <Route exact path={createPagePath} component={CreatePage} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};
