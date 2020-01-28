import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { DataSourceTag } from './dataSourceTag.component';
import { DataSourceTagRoutines, selectTag } from '../../modules/dataSourceTag';

const mapStateToProps = createStructuredSelector({
  tag: selectTag,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchTag: promisifyRoutine(DataSourceTagRoutines.fetchTag),
      updateTag: promisifyRoutine(DataSourceTagRoutines.updateTag),
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
)(DataSourceTag);
