import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { selectIsAuthenticated, selectIsFetched } from '../../../modules/userAuth';
import { AuthRoute } from './authRoute.component';


const mapStateToProps = createStructuredSelector({
  isAuthenticated: selectIsAuthenticated,
  isUserFetched: selectIsFetched,
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default compose(
  hot(module),
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(AuthRoute);
