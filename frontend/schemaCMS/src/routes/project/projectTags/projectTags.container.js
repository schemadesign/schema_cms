import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { ProjectTags } from './projectTags.component';
import { selectUserRole } from '../../../modules/userProfile';
import { ProjectTagRoutines, selectTags } from '../../../modules/projectTag';
import { selectProject } from '../../../modules/project';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  project: selectProject,
  tags: selectTags,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchTags: promisifyRoutine(ProjectTagRoutines.fetchList),
      setTags: promisifyRoutine(ProjectTagRoutines.setTags),
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
  injectIntl,
  withRouter
)(ProjectTags);
