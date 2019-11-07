import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { View } from './view.component';
import {
  DataSourceRoutines,
  selectDataSource,
  selectFields,
  selectPreviewTable,
  selectIsAnyJobProcessing,
} from '../../../modules/dataSource';
import { DataWranglingScriptsRoutines, selectDataWranglingScripts } from '../../../modules/dataWranglingScripts';
import { selectFilters } from '../../../modules/filter';
import { FilterRoutines } from '../../../modules/filter/filter.redux';

const mapStateToProps = createStructuredSelector({
  dataSource: selectDataSource,
  dataWranglingScripts: selectDataWranglingScripts,
  fields: selectFields,
  filters: selectFilters,
  previewTable: selectPreviewTable,
  isAnyJobProcessing: selectIsAnyJobProcessing,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      removeDataSource: promisifyRoutine(DataSourceRoutines.removeOne),
      updateDataSource: promisifyRoutine(DataSourceRoutines.updateOne),
      fetchDataWranglingScripts: promisifyRoutine(DataWranglingScriptsRoutines.fetchList),
      uploadScript: promisifyRoutine(DataWranglingScriptsRoutines.uploadScript),
      sendUpdatedDataWranglingScript: promisifyRoutine(DataWranglingScriptsRoutines.sendList),
      fetchFields: promisifyRoutine(DataSourceRoutines.fetchFields),
      unmountFields: promisifyRoutine(DataSourceRoutines.unmountFields),
      fetchFilters: promisifyRoutine(FilterRoutines.fetchList),
      setFilters: promisifyRoutine(FilterRoutines.setFilters),
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
)(View);
