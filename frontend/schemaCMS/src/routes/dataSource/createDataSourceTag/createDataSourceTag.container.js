import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose } from 'ramda';

import { CreateDataSourceTag } from './createDataSourceTag.component';
import { selectDataSource } from '../../../modules/dataSource';
import { DataSourceTagRoutines } from '../../../modules/dataSourceTag';
import { selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  dataSource: selectDataSource,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      createTag: promisifyRoutine(DataSourceTagRoutines.createTag),
      removeTag: promisifyRoutine(DataSourceTagRoutines.removeTag),
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
)(CreateDataSourceTag);
