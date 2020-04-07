import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { CreatePage } from './createPage.component';
import { selectUserRole } from '../../../modules/userProfile';
import { PageTemplatesRoutines, selectPageTemplates } from '../../../modules/pageTemplates';
import { PageRoutines } from '../../../modules/page';
import { selectProject } from '../../../modules/project';
import { BlockTemplatesRoutines, selectBlockTemplates } from '../../../modules/blockTemplates';
import { selectSection } from '../../../modules/sections';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  project: selectProject,
  pageTemplates: selectPageTemplates,
  blockTemplates: selectBlockTemplates,
  section: selectSection,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      createPage: promisifyRoutine(PageRoutines.createPage),
      fetchPageTemplates: promisifyRoutine(PageTemplatesRoutines.fetchPageTemplates),
      fetchBlockTemplates: promisifyRoutine(BlockTemplatesRoutines.fetchBlockTemplates),
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
