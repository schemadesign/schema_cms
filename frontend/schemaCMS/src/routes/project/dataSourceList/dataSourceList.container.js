import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { injectIntl } from 'react-intl';
import { withTheme } from 'styled-components';

import { compose } from 'ramda';
import { DataSourceList } from './dataSourceList.component';
import { DataSourceRoutines, selectDataSources, selectUploadingDataSources } from '../../../modules/dataSource';
import { selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  dataSources: selectDataSources,
  uploadingDataSources: selectUploadingDataSources,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      createDataSource: promisifyRoutine(DataSourceRoutines.create),
      fetchDataSources: promisifyRoutine(DataSourceRoutines.fetchList),
      cancelFetchListLoop: promisifyRoutine(DataSourceRoutines.cancelFetchListLoop),
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
  withRouter,
  withTheme
)(DataSourceList);
