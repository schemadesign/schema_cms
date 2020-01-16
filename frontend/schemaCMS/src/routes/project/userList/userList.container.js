import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import { compose } from 'ramda';
import { promisifyRoutine, bindPromiseCreators } from 'redux-saga-routines';

import { UserList } from './userList.component';
import { ProjectRoutines, selectEditors } from '../../../modules/project';
import { selectIsAdmin, selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  users: selectEditors,
  isAdmin: selectIsAdmin,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchUsers: promisifyRoutine(ProjectRoutines.fetchEditors),
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
)(UserList);
