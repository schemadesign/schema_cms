import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { Jwt } from './jwt.component';
import { UserAuthActions } from '../../modules/userAuth';

const mapStateToProps = createStructuredSelector({});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getJwtToken: UserAuthActions.getJwtToken,
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
)(Jwt);
