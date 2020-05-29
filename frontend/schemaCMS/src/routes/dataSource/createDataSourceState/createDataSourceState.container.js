import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { CreateDataSourceState } from './createDataSourceState.component';
import { selectUserRole } from '../../../modules/userProfile';
import { DataSourceRoutines, selectDataSources } from '../../../modules/dataSource';
import { DataSourceStateRoutines } from '../../../modules/dataSourceState';
import { selectProject } from '../../../modules/project';
import { DataSourceTagsRoutines, selectDataSourceTags } from '../../../modules/dataSourceTags';
import { FilterRoutines, selectFilters } from '../../../modules/filter';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  dataSources: selectDataSources,
  project: selectProject,
  dataSourceTags: selectDataSourceTags,
  filters: selectFilters,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchDataSources: promisifyRoutine(DataSourceRoutines.fetchList),
      fetchFilters: promisifyRoutine(FilterRoutines.fetchList),
      createState: promisifyRoutine(DataSourceStateRoutines.create),
      fetchDataSourceTags: promisifyRoutine(DataSourceTagsRoutines.fetchDataSourceTags),
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
)(CreateDataSourceState);
