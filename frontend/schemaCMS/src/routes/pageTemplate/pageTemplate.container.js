import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { PageTemplate } from './pageTemplate.component';
import { BlockTemplatesRoutines, selectBlockTemplates } from '../../modules/blockTemplates';
import { PageTemplatesRoutines, selectPageTemplate } from '../../modules/pageTemplates';
import { selectUserRole } from '../../modules/userProfile';
import { selectProject } from '../../modules/project';

const mapStateToProps = createStructuredSelector({
  pageTemplate: selectPageTemplate,
  blockTemplates: selectBlockTemplates,
  userRole: selectUserRole,
  project: selectProject,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchBlockTemplates: promisifyRoutine(BlockTemplatesRoutines.fetchBlockTemplates),
      fetchPageTemplate: promisifyRoutine(PageTemplatesRoutines.fetchPageTemplate),
      updatePageTemplate: promisifyRoutine(PageTemplatesRoutines.updatePageTemplate),
      removePageTemplate: promisifyRoutine(PageTemplatesRoutines.removePageTemplate),
    },
    dispatch
  ),
});

export default compose(hot(module), connect(mapStateToProps, mapDispatchToProps), withRouter)(PageTemplate);
