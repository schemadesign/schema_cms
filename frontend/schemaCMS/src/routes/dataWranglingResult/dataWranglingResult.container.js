import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { DataWranglingResult } from './dataWranglingResult.component';
import { DataSourceRoutines, selectJobPreview } from '../../modules/dataSource';

const mapStateToProps = createStructuredSelector({
  previewData: selectJobPreview,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchResult: promisifyRoutine(DataSourceRoutines.fetchPreview),
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
