import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';

import { NotFound } from '../notFound';
import { PageList } from './pageList';
import { CreatePage } from './createPage';
import { AddBlock } from './addBlock';

export const Section = () => {
  const { path } = useRouteMatch();
  const createPagePath = `${path}/create-page`;
  const addBlockPath = `${createPagePath}/add-block`;

  return (
    <Switch>
      <Route exact path={path} component={PageList} />
      <Route exact path={createPagePath} component={CreatePage} />
      <Route exact path={addBlockPath} component={AddBlock} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};
