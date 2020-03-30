import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import { compose } from 'ramda';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { AddUser } from './addUser.component';

import { ProjectRoutines, selectEditors } from '../../../modules/project';
import { selectEditorUsers, UserRoutines } from '../../../modules/user';
import { selectIsAdmin, selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  users: selectEditorUsers,
  isAdmin: selectIsAdmin,
  usersInProject: selectEditors,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchUsers: promisifyRoutine(UserRoutines.fetchUsers),
      fetchProjectEditors: promisifyRoutine(ProjectRoutines.fetchEditors),
    },
    dispatch
  );

export default compose(hot(module), connect(mapStateToProps, mapDispatchToProps), injectIntl, withRouter)(AddUser);
