import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import { compose } from 'ramda';
import { promisifyRoutine, bindPromiseCreators } from 'redux-saga-routines';

import { UserList } from './userList.component';
import { ProjectRoutines } from '../../../modules/project';
import { selectProject, selectProjectUsers } from '../../../modules/project/project.selectors';
import { selectIsAdmin } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  users: selectProjectUsers,
  project: selectProject,
  isAdmin: selectIsAdmin,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchProject: promisifyRoutine(ProjectRoutines.fetchOne),
      clearProject: promisifyRoutine(ProjectRoutines.unmountOne),
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
