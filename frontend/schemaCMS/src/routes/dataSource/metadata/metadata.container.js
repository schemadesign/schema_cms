import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { Metadata } from './metadata.component';
import { selectDataSource } from '../../../modules/dataSource';
import { selectUserRole } from '../../../modules/userProfile';
import { selectProject } from '../../../modules/project';
import { MetadataRoutines, selectMetadata } from '../../../modules/metadata';
import { JobRoutines, selectJobPreview } from '../../../modules/job';

const mapStateToProps = createStructuredSelector({
  dataSource: selectDataSource,
  userRole: selectUserRole,
  project: selectProject,
  metadata: selectMetadata,
  previewData: selectJobPreview,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchMetadata: promisifyRoutine(MetadataRoutines.fetchMetadata),
      updateMetadata: promisifyRoutine(MetadataRoutines.updateMetadata),
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
  withRouter
)(Metadata);
