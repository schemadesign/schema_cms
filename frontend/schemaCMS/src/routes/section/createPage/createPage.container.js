import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { CreatePage } from './createPage.component';
import { selectUserRole, selectIsAdmin } from '../../../modules/userProfile';
import { PageRoutines, selectPageAdditonalData } from '../../../modules/page';
import { selectProject } from '../../../modules/project';
import { selectSection, SectionsRoutines } from '../../../modules/sections';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  isAdmin: selectIsAdmin,
  project: selectProject,
  section: selectSection,
  pageAdditionalData: selectPageAdditonalData,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      createPage: promisifyRoutine(PageRoutines.createPage),
      fetchSection: promisifyRoutine(SectionsRoutines.fetchSection),
      fetchPageAdditionalData: promisifyRoutine(PageRoutines.fetchPageAdditionalData),
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
)(CreatePage);
