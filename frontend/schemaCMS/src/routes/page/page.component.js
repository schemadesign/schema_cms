import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';

import { PageBlockList } from './pageBlockList';

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
        <Route exact path={pagePath} component={PageBlockList} />
      </Switch>
    );
  }
}
