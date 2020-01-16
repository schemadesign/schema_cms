import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { Filter } from './filter.component';
import { DataSourceRoutines, selectFieldsInfo } from '../../modules/dataSource';
import { FilterRoutines, selectFilter } from '../../modules/filter';

const mapStateToProps = createStructuredSelector({
  fieldsInfo: selectFieldsInfo,
  filter: selectFilter,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchFieldsInfo: promisifyRoutine(DataSourceRoutines.fetchFieldsInfo),
      fetchFilter: promisifyRoutine(FilterRoutines.fetchFilter),
      updateFilter: promisifyRoutine(FilterRoutines.updateFilter),
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
)(Filter);
