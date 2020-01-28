import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { DataSourceTags } from './dataSourceTags.component';
import { selectDataSource } from '../../../modules/dataSource';
import { selectUserRole } from '../../../modules/userProfile';
import { DataSourceTagRoutines, selectTags } from '../../../modules/dataSourceTag';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  dataSource: selectDataSource,
  tags: selectTags,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchTags: promisifyRoutine(DataSourceTagRoutines.fetchList),
      setTags: promisifyRoutine(DataSourceTagRoutines.setTags),
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
)(DataSourceTags);
