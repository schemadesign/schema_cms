import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { DataSourceState } from './dataSourceState.component';

const mapStateToProps = createStructuredSelector({});

export const mapDispatchToProps = () => ({});

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DataSourceState);
