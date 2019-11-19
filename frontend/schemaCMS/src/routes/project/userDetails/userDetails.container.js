import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { UserDetails } from './userDetails.component';
import { selectUser, UserRoutines } from '../../../modules/user';
import { ProjectRoutines } from '../../../modules/project';

const mapStateToProps = createStructuredSelector({
  userData: selectUser,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchUser: promisifyRoutine(UserRoutines.fetchUser),
      removeEditorFromProject: promisifyRoutine(ProjectRoutines.removeEditor),
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
)(UserDetails);
