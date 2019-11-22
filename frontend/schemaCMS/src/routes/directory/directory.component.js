import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';

import { PageList } from './pageList';

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

    return (
      <Switch>
        <Route exact path={directoryPath} component={PageList} />
      </Switch>
    );
  }
}
