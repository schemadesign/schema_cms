import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { Filters } from './filters.component';
import { selectDataSource } from '../../../modules/dataSource';
import { selectFilters } from '../../../modules/filter';
import { FilterRoutines } from '../../../modules/filter/filter.redux';
import { selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  dataSource: selectDataSource,
  filters: selectFilters,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchFilters: promisifyRoutine(FilterRoutines.fetchList),
      setFilters: promisifyRoutine(FilterRoutines.setFilters),
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
)(Filters);
