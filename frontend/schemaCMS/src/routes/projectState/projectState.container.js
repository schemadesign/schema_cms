import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { ProjectState } from './projectState.component';
import { ProjectStateRoutines, selectState } from '../../modules/projectState';

const mapStateToProps = createStructuredSelector({
  state: selectState,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchState: promisifyRoutine(ProjectStateRoutines.fetchOne),
    },
    dispatch
  ),
});

export default compose(hot(module), connect(mapStateToProps, mapDispatchToProps), withRouter)(ProjectState);
