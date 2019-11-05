import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { JobList } from './jobList.component';
import { JobRoutines, selectJobList } from '../../../modules/job';

const mapStateToProps = createStructuredSelector({
  jobList: selectJobList,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchJobList: promisifyRoutine(JobRoutines.fetchJobList),
      revertToJob: promisifyRoutine(JobRoutines.revertToJob),
    },
    dispatch
  );

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(JobList);
