import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { App } from './app.component';
import { StartupActions } from '../modules/startup';
import { selectUserData } from '../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userData: selectUserData,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      startup: StartupActions.startup,
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
)(App);
