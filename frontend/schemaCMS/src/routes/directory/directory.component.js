import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';

import { PageList } from './pageList';
import { CreatePage } from './createPage';

export class Directory extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string,
    }),
  };

  render() {
    const { match } = this.props;
    const { path } = match;
    const directoryPath = `${path}/:directoryId`;
    const createPagePath = `${path}/:directoryId/page`;

    return (
      <Switch>
        <Route exact path={directoryPath} component={PageList} />
        <Route exact path={createPagePath} component={CreatePage} />
      </Switch>
    );
  }
}
