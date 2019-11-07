import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { withTheme } from 'styled-components';

import { JobList } from './jobList.component';
import { JobRoutines, selectJobList } from '../../../modules/job';
import { DataSourceRoutines, selectDataSource } from '../../../modules/dataSource';

const mapStateToProps = createStructuredSelector({
  jobList: selectJobList,
  dataSource: selectDataSource,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchJobList: promisifyRoutine(JobRoutines.fetchJobList),
      revertToJob: promisifyRoutine(DataSourceRoutines.revertToJob),
    },
    dispatch
  );

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter,
  withTheme
)(JobList);
