import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { DataSourceState } from './dataSourceState.component';
import { DataSourceStateRoutines } from '../../modules/dataSourceState';
import { selectProject } from '../../modules/project';

const mapStateToProps = createStructuredSelector({
  project: selectProject,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchState: promisifyRoutine(DataSourceStateRoutines.fetchOne),
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
)(DataSourceState);
