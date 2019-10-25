import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { User } from './user.component';
import { UserRoutines, selectUser } from '../../modules/user';
import { ProjectRoutines, selectProject } from '../../modules/project';

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  project: selectProject,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      createUserProject: promisifyRoutine(ProjectRoutines.addEditor),
      createUserCMS: promisifyRoutine(UserRoutines.createUserCMS),
      fetchProject: promisifyRoutine(ProjectRoutines.fetchOne),
      fetchUser: promisifyRoutine(UserRoutines.fetchUser),
      clearProject: promisifyRoutine(ProjectRoutines.unmountOne),
      clearUser: promisifyRoutine(UserRoutines.unmountUser),
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
)(User);
