import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { EditPage } from './editPage.component';
import { selectUserRole } from '../../../modules/userProfile';
import { PageRoutines, selectPage } from '../../../modules/page';
import { selectProject } from '../../../modules/project';
import { PageTemplatesRoutines, selectPageTemplates } from '../../../modules/pageTemplates';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  page: selectPage,
  project: selectProject,
  pageTemplates: selectPageTemplates,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      updatePage: promisifyRoutine(PageRoutines.updatePage),
      removePage: promisifyRoutine(PageRoutines.removePage),
      fetchPageTemplates: promisifyRoutine(PageTemplatesRoutines.fetchPageTemplates),
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
