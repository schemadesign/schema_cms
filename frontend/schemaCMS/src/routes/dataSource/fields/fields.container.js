import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { Fields } from './fields.component';
import { DataSourceRoutines, selectDataSource, selectPreviewData } from '../../../modules/dataSource';
import { selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  dataSource: selectDataSource,
  previewData: selectPreviewData,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchPreview: promisifyRoutine(DataSourceRoutines.fetchPreview),
    },
    dispatch
  ),
});

export default compose(hot(module), connect(mapStateToProps, mapDispatchToProps), injectIntl, withRouter)(Fields);
