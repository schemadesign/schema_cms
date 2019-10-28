import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { JobDetail } from './jobDetail.component';
import { JobRoutines, selectJob } from '../../modules/job';

const mapStateToProps = createStructuredSelector({
  job: selectJob,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchOne: promisifyRoutine(JobRoutines.fetchOne),
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
)(JobDetail);
