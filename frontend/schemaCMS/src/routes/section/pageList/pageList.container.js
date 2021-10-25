import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { PageList } from './pageList.component';
import { SectionsRoutines, selectPages, selectSection } from '../../../modules/sections';
import { selectUserRole } from '../../../modules/userProfile';
import { selectProject } from '../../../modules/project';
import { PageRoutines } from '../../../modules/page';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  section: selectSection,
  project: selectProject,
  pages: selectPages,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      updateSection: promisifyRoutine(SectionsRoutines.updateSection),
      removeSection: promisifyRoutine(SectionsRoutines.removeSection),
      fetchSection: promisifyRoutine(SectionsRoutines.fetchSection),
      fetchPages: promisifyRoutine(SectionsRoutines.fetchPages),
      copyPage: promisifyRoutine(PageRoutines.copyPage),
      removePage: promisifyRoutine(PageRoutines.removePage),
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
