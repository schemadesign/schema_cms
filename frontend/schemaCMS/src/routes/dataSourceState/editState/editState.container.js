import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { EditState } from './editState.component';
import { DataSourceStateRoutines, selectState } from '../../../modules/dataSourceState';
import { selectProject } from '../../../modules/project';
import { selectUserRole } from '../../../modules/userProfile';
import { DataSourceTagsRoutines, selectDataSourceTags } from '../../../modules/dataSourceTags';
import { selectFilters, FilterRoutines } from '../../../modules/filter';

const mapStateToProps = createStructuredSelector({
  state: selectState,
  project: selectProject,
  userRole: selectUserRole,
  dataSourceTags: selectDataSourceTags,
  filters: selectFilters,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      removeState: promisifyRoutine(DataSourceStateRoutines.remove),
      updateState: promisifyRoutine(DataSourceStateRoutines.update),
      fetchState: promisifyRoutine(DataSourceStateRoutines.fetchOne),
      fetchDataSourceTags: promisifyRoutine(DataSourceTagsRoutines.fetchDataSourceTags),
      fetchFilters: promisifyRoutine(FilterRoutines.fetchList),
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
)(EditState);
