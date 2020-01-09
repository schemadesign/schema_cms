import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';

import { PageList } from './pageList';
import { CreatePage } from './createPage';
import { Edit } from './edit';
import { NotFound } from '../notFound';

export class Folder extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string,
    }),
  };

  render() {
    const { match } = this.props;
    const { path } = match;
    const folderPath = `${path}/:folderId`;
    const createPagePath = `${path}/:folderId/page`;
    const editPath = `${path}/:folderId/edit`;

    return (
      <Switch>
        <Route exact path={folderPath} component={PageList} />
        <Route exact path={createPagePath} component={CreatePage} />
        <Route exact path={editPath} component={Edit} />
        <Route path="*" component={NotFound} />
      </Switch>
    );
  }
}
