import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { DataSourceStateList } from './dataSourceStateList.component';
import { DataSourceStateRoutines, selectStates } from '../../../modules/dataSourceState';
import { selectUserRole } from '../../../modules/userProfile';
import { selectProject } from '../../../modules/project';
import { selectDataSource } from '../../../modules/dataSource';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  states: selectStates,
  project: selectProject,
  dataSource: selectDataSource,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchStates: promisifyRoutine(DataSourceStateRoutines.fetchList),
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
)(DataSourceStateList);
