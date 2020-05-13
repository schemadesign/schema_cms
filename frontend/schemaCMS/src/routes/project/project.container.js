import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { Project } from './project.component';

import { ProjectRoutines, selectProject } from '../../modules/project';

const mapStateToProps = createStructuredSelector({
  project: selectProject,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchProject: promisifyRoutine(ProjectRoutines.fetchOne),
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
)(Project);
