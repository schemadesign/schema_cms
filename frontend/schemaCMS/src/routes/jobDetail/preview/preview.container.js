import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { Preview } from './preview.component';
import { JobRoutines, selectJobPreview } from '../../../modules/job';

const mapStateToProps = createStructuredSelector({
  previewData: selectJobPreview,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchPreview: promisifyRoutine(JobRoutines.fetchPreview),
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
)(Preview);
