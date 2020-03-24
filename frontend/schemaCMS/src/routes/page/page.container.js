import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { Page } from './page.component';
import { selectUserRole } from '../../modules/userProfile';
import { PageRoutines, selectPage } from '../../modules/page';
import { selectProject } from '../../modules/project';
import { PageTemplatesRoutines, selectPageTemplates } from '../../modules/pageTemplates';

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
      fetchPage: promisifyRoutine(PageRoutines.fetchPage),
      removePage: promisifyRoutine(PageRoutines.removePage),
      setTemporaryPageBlocks: promisifyRoutine(PageRoutines.setTemporaryPageBlocks),
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
)(Page);
