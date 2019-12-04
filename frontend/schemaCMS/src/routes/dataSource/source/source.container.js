import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { Source } from './source.component';
import { DataSourceRoutines, selectDataSource } from '../../../modules/dataSource';
import { selectIsAdmin } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  dataSource: selectDataSource,
  isAdmin: selectIsAdmin,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      removeDataSource: promisifyRoutine(DataSourceRoutines.removeOne),
      onDataSourceChange: promisifyRoutine(DataSourceRoutines.updateOne),
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
)(Source);
