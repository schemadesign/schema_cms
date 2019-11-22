import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';

import { PageList } from './pageList';
import { Edit } from './edit';

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
    const editPath = `${path}/:directoryId/edit`;

    return (
      <Switch>
        <Route exact path={directoryPath} component={PageList} />
        <Route exact path={editPath} component={Edit} />
      </Switch>
    );
  }
}
