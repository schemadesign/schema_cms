import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { DataSourceState } from './dataSourceState.component';
import { DataSourceStateRoutines, selectState } from '../../modules/dataSourceState';
import { selectProject } from '../../modules/project';
import { selectUserRole } from '../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  state: selectState,
  project: selectProject,
  userRole: selectUserRole,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchState: promisifyRoutine(DataSourceStateRoutines.fetchOne),
      removeState: promisifyRoutine(DataSourceStateRoutines.removeState),
      updateState: promisifyRoutine(DataSourceStateRoutines.update),
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
  withRouter
)(DataSourceState);
