import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose } from 'ramda';

import { CreateFilter } from './createFilter.component';
import { DataSourceRoutines, selectFieldsInfo, selectDataSource } from '../../../modules/dataSource';
import { FilterRoutines } from '../../../modules/filter';
import { selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  fieldsInfo: selectFieldsInfo,
  dataSource: selectDataSource,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchFieldsInfo: promisifyRoutine(DataSourceRoutines.fetchFieldsInfo),
      createFilter: promisifyRoutine(FilterRoutines.createFilter),
      removeFilter: promisifyRoutine(FilterRoutines.removeFilter),
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
)(CreateFilter);
