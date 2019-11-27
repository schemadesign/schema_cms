import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';

import { PageBlockList } from './pageBlockList';
import { CreatePageBlock } from './createBlock';
import { Edit } from './edit';

export class Page extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string,
    }),
  };

  render() {
    const { match } = this.props;
    const { path } = match;
    const pagePath = `${path}/:pageId`;
    const createPageBlockPath = `${pagePath}/block/create`;
    const editPagePath = `${path}/:pageId/edit`;

    return (
      <Switch>
        <Route exact path={pagePath} component={PageBlockList} />
        <Route exact path={createPageBlockPath} component={CreatePageBlock} />
        <Route exact path={editPagePath} component={Edit} />
      </Switch>
    );
  }
}
