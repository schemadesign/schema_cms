import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { DataWranglingResult } from './dataWranglingResult.component';
import { JobRoutines, selectJobPreview } from '../../../modules/job';
import { selectDataSource } from '../../../modules/dataSource';
import { selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  previewData: selectJobPreview,
  dataSource: selectDataSource,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchPreview: promisifyRoutine(JobRoutines.fetchPreview),
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
)(DataWranglingResult);
