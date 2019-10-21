import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { Settings } from './settings.component';
import { selectUserData, UserProfileRoutines } from '../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userData: selectUserData,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateMe: UserProfileRoutines.updateMe,
    },
    dispatch
  );

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl,
  withRouter
)(Settings);
