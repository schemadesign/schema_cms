import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { DataWranglingResultRoutines, selectFields, selectPreviewTable } from '../../modules/dataWranglingResult';
import { DataWranglingResult } from './dataWranglingResult.component';

const mapStateToProps = createStructuredSelector({
  fields: selectFields,
  previewTable: selectPreviewTable,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchResult: promisifyRoutine(DataWranglingResultRoutines.fetch),
      unmountResult: promisifyRoutine(DataWranglingResultRoutines.unmount),
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
