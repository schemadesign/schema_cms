import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { PageTemplates } from './pageTemplates.component';
import { PageTemplatesRoutines, selectPageTemplates } from '../../../modules/pageTemplates';
import { selectUserRole } from '../../../modules/userProfile';
import { selectProject } from '../../../modules/project';

const mapStateToProps = createStructuredSelector({
  pageTemplates: selectPageTemplates,
  userRole: selectUserRole,
  project: selectProject,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchPageTemplates: promisifyRoutine(PageTemplatesRoutines.fetchPageTemplates),
      copyPageTemplate: promisifyRoutine(PageTemplatesRoutines.copyPageTemplate),
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
)(PageTemplates);
