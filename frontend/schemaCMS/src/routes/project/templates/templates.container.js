import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { Templates } from './templates.component';
import { selectUserRole } from '../../../modules/userProfile';
import { ProjectRoutines, selectTemplates } from '../../../modules/project';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  templates: selectTemplates,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchTemplates: promisifyRoutine(ProjectRoutines.fetchTemplates),
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
)(Templates);
