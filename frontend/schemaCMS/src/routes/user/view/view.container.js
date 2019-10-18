import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { promisifyRoutine, bindPromiseCreators } from 'redux-saga-routines';

import { View } from './view.component';
import { selectUsers, UserRoutines } from '../../../modules/user';

const mapStateToProps = createStructuredSelector({
  users: selectUsers,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchUsers: promisifyRoutine(UserRoutines.fetchUsers),
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
)(View);
