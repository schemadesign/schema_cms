import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import { compose } from 'ramda';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { DataSourceRoutines, selectFields, selectPreviewTable } from '../../../../../modules/dataSource';
import { Fields } from './fields.component';

const mapStateToProps = createStructuredSelector({
  fields: selectFields,
  previewTable: selectPreviewTable,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchFields: promisifyRoutine(DataSourceRoutines.fetchFields),
      unmountFields: promisifyRoutine(DataSourceRoutines.unmountFields),
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
)(Fields);
