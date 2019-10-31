import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { List } from './list.component';
import { DataSourceRoutines, selectFields } from '../../../modules/dataSource';

const mapStateToProps = createStructuredSelector({
  fields: selectFields,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchFields: promisifyRoutine(DataSourceRoutines.fetchFields),
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
)(List);
