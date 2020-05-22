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

const mapStateToProps = createStructuredSelector({
  dataSource: selectDataSource,
  userRole: selectUserRole,
  project: selectProject,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators({}, dispatch),
});

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(Metadata);
