import { connect } from 'react-redux';
import { bindPromiseCreators } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { DataSourceTags } from './dataSourceTags.component';

const mapStateToProps = createStructuredSelector({});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators({}, dispatch),
});

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(DataSourceTags);
