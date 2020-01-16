import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { Settings } from './settings.component';
import { selectUserData, selectUserRole, UserProfileRoutines } from '../../modules/userProfile';
import { ProjectRoutines } from '../../modules/project';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  userData: selectUserData,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      updateMe: promisifyRoutine(UserProfileRoutines.updateMe),
      clearProject: promisifyRoutine(ProjectRoutines.clearProject),
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
)(Settings);
