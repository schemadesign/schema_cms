import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import { compose } from 'ramda';

import { NotAuthorized } from './notAuthorized.component';
import { selectIsAdmin } from '../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  isAdmin: selectIsAdmin,
});

export const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default compose(
  hot(module),
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
  withRouter
)(NotAuthorized);
