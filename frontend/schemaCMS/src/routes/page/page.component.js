import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';

import { BlockList } from './blockList';

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

    return (
      <Switch>
        <Route exact path={pagePath} component={BlockList} />
      </Switch>
    );
  }
}
