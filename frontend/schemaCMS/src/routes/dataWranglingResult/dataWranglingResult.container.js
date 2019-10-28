import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { JobRoutines, selectJobPreview } from '../../modules/job';
import { DataWranglingResult } from './dataWranglingResult.component';

const mapStateToProps = createStructuredSelector({
  previewData: selectJobPreview,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchResult: promisifyRoutine(JobRoutines.fetchPreview),
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
)(DataWranglingResult);
