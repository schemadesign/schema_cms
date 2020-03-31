import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { PageList } from './pageList.component';
import { SectionsRoutines, selectSection } from '../../../modules/sections';
import { selectUserRole } from '../../../modules/userProfile';
import { selectProject } from '../../../modules/project';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  section: selectSection,
  project: selectProject,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      updateSection: promisifyRoutine(SectionsRoutines.updateSection),
      removeSection: promisifyRoutine(SectionsRoutines.removeSection),
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
)(PageList);
