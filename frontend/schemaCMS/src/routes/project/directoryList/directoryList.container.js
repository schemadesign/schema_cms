import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { DirectoryList } from './directoryList.component';
import { selectDirectories, DirectoryRoutines } from '../../../modules/directory';

const mapStateToProps = createStructuredSelector({
  directories: selectDirectories,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchList: promisifyRoutine(DirectoryRoutines.fetchList),
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
)(DirectoryList);
