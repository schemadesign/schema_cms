import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { StateFilter } from './stateFilter.component';
import { FilterRoutines, selectFilter } from '../../../modules/filter';
import { selectState } from '../../../modules/dataSourceState';
import { selectUserRole } from '../../../modules/userProfile';
import { DataSourceRoutines, selectFieldsInfo } from '../../../modules/dataSource';
import { selectProject } from '../../../modules/project';

const mapStateToProps = createStructuredSelector({
  filter: selectFilter,
  state: selectState,
  project: selectProject,
  userRole: selectUserRole,
  fieldsInfo: selectFieldsInfo,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchFilter: promisifyRoutine(FilterRoutines.fetchFilter),
      fetchFieldsInfo: promisifyRoutine(DataSourceRoutines.fetchFieldsInfo),
    },
    dispatch
  ),
});

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(StateFilter);
