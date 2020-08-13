import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { EditPage } from './editPage.component';
import { selectUserRole } from '../../../modules/userProfile';
import { PageRoutines, selectPage, selectPageAdditonalData } from '../../../modules/page';
import { selectProject } from '../../../modules/project';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  page: selectPage,
  project: selectProject,
  pageAdditionalData: selectPageAdditonalData,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      updatePage: promisifyRoutine(PageRoutines.updatePage),
      removePage: promisifyRoutine(PageRoutines.removePage),
      copyPage: promisifyRoutine(PageRoutines.copyPage),
      publishPage: promisifyRoutine(PageRoutines.publishPage),
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
)(EditPage);
