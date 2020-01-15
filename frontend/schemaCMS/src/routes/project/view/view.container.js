import { connect } from 'react-redux';
import { promisifyRoutine, bindPromiseCreators } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import { compose } from 'ramda';

import { View } from './view.component';
import { ProjectRoutines } from '../../../modules/project';
import { selectProject } from '../../../modules/project/project.selectors';
import { selectIsAdmin, selectUserRole } from '../../../modules/userProfile/userProfile.selectors';

const mapStateToProps = createStructuredSelector({
  isAdmin: selectIsAdmin,
  project: selectProject,
  userRole: selectUserRole,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchProject: promisifyRoutine(ProjectRoutines.fetchOne),
      unmountProject: promisifyRoutine(ProjectRoutines.unmountOne),
      removeProject: promisifyRoutine(ProjectRoutines.removeOne),
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
)(View);
