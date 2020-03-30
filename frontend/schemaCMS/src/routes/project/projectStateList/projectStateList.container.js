import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { ProjectStateList } from './projectStateList.component';
import { ProjectStateRoutines, selectStates } from '../../../modules/projectState';
import { selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  states: selectStates,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchStates: promisifyRoutine(ProjectStateRoutines.fetchList),
    },
    dispatch
  ),
});

export default compose(
  hot(module),
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
  withRouter
)(ProjectStateList);
