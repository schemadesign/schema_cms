import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { FolderList } from './folderList.component';
import { selectFolders, FolderRoutines } from '../../../modules/folder';

const mapStateToProps = createStructuredSelector({
  folders: selectFolders,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchFolders: promisifyRoutine(FolderRoutines.fetchList),
    },
    dispatch
  ),
});

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl,
  withRouter
)(FolderList);
