import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import { compose } from 'ramda';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { AddUser } from './addUser.component';

import { ProjectRoutines, selectProjectUsers } from '../../../modules/project';
import { selectEditorUsers, UserRoutines } from '../../../modules/user';
import { selectIsAdmin } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  users: selectEditorUsers,
  isAdmin: selectIsAdmin,
  usersInProject: selectProjectUsers,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchUsers: promisifyRoutine(UserRoutines.fetchUsers),
      fetchProject: promisifyRoutine(ProjectRoutines.fetchOne),
      removeUser: promisifyRoutine(ProjectRoutines.removeEditor),
    },
    dispatch
  );

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl,
  withRouter
)(AddUser);
