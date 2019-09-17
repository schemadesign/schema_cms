import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { View } from './view.component';
import { DataSourceRoutines, selectDataSource } from '../../../../modules/dataSource';
import { DataWranglingRoutines, selectDataWrangling } from '../../../../modules/dataWrangling';

const mapStateToProps = createStructuredSelector({
  dataSource: selectDataSource,
  dataWrangling: selectDataWrangling,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      removeDataSource: promisifyRoutine(DataSourceRoutines.removeOne),
      fetchDataSource: promisifyRoutine(DataSourceRoutines.fetchOne),
      updateDataSource: promisifyRoutine(DataSourceRoutines.updateOne),
      unmountDataSource: promisifyRoutine(DataSourceRoutines.unmountOne),
      fetchDataWrangling: promisifyRoutine(DataWranglingRoutines.fetchList),
      uploadScript: promisifyRoutine(DataWranglingRoutines.uploadScript),
      sendUpdatedDataWrangling: promisifyRoutine(DataWranglingRoutines.sendList),
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
