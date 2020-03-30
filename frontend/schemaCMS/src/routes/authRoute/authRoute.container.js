import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { AuthRoute } from './authRoute.component';

import { selectIsAuthenticated } from '../../modules/userAuth';
import { selectIsFetched } from '../../modules/userProfile';
import { UserProfileRoutines } from '../../modules/userProfile/userProfile.redux';

const mapStateToProps = createStructuredSelector({
  isAuthenticated: selectIsAuthenticated,
  isUserFetched: selectIsFetched,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchCurrentUser: UserProfileRoutines.fetchUserDetails,
    },
    dispatch
  );

export default compose(hot(module), connect(mapStateToProps, mapDispatchToProps), withRouter)(AuthRoute);
