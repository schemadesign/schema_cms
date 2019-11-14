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
  selectPreviewData,
  selectIsAnyJobProcessing,
} from '../../../modules/dataSource';
import { DataWranglingScriptsRoutines, selectDataWranglingScripts } from '../../../modules/dataWranglingScripts';
import { selectFilters } from '../../../modules/filter';
import { FilterRoutines } from '../../../modules/filter/filter.redux';

const mapStateToProps = createStructuredSelector({
  dataSource: selectDataSource,
  dataWranglingScripts: selectDataWranglingScripts,
  filters: selectFilters,
  previewData: selectPreviewData,
  isAnyJobProcessing: selectIsAnyJobProcessing,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      removeDataSource: promisifyRoutine(DataSourceRoutines.removeOne),
      onDataSourceChange: promisifyRoutine(DataSourceRoutines.updateOne),
      fetchDataWranglingScripts: promisifyRoutine(DataWranglingScriptsRoutines.fetchList),
      uploadScript: promisifyRoutine(DataWranglingScriptsRoutines.uploadScript),
      sendUpdatedDataWranglingScript: promisifyRoutine(DataWranglingScriptsRoutines.sendList),
      fetchPreview: promisifyRoutine(DataSourceRoutines.fetchPreview),
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
