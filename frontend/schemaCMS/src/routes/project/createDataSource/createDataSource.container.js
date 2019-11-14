import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { CreateDataSource } from './createDataSource.component';
import { DataSourceRoutines } from '../../../modules/dataSource';

const mapStateToProps = createStructuredSelector({});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      onDataSourceChange: promisifyRoutine(DataSourceRoutines.create),
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
)(CreateDataSource);
