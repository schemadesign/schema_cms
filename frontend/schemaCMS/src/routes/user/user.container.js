import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { User } from './user.component';
import { UserRoutines } from '../../modules/user';
import { selectUserData } from '../../modules/userProfile';
import { ProjectRoutines, selectProject, selectProjectFetched } from '../../modules/project';

const mapStateToProps = createStructuredSelector({
  user: selectUserData,
  project: selectProject,
  isFetched: selectProjectFetched,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      createUserProject: promisifyRoutine(UserRoutines.createUserProject),
      createUserCMS: promisifyRoutine(UserRoutines.createUserCMS),
      fetchProject: promisifyRoutine(ProjectRoutines.fetchOne),
      clearProject: promisifyRoutine(ProjectRoutines.unmountOne),
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
