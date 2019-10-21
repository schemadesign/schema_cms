import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { promisifyRoutine, bindPromiseCreators } from 'redux-saga-routines';
import { injectIntl } from 'react-intl';

import { View } from './view.component';
import { selectUser, UserRoutines } from '../../../modules/user';

const mapStateToProps = createStructuredSelector({
  userData: selectUser,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchUser: promisifyRoutine(UserRoutines.fetchUser),
      makeAdmin: promisifyRoutine(UserRoutines.makeAdmin),
      removeUser: promisifyRoutine(UserRoutines.removeUser),
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
)(View);
