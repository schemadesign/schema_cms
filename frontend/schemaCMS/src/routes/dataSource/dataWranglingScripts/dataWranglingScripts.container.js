import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import {
  DataWranglingScriptsRoutines,
  selectCheckedScripts,
  selectCustomScripts,
  selectDataWranglingScripts,
  selectImageScrapingFields,
  selectUncheckedScripts,
} from '../../../modules/dataWranglingScripts';
import { DataWranglingScripts } from './dataWranglingScripts.component';
import { selectDataSource } from '../../../modules/dataSource';
import { selectIsAdmin, selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  dataSource: selectDataSource,
  dataWranglingScripts: selectDataWranglingScripts,
  checkedScripts: selectCheckedScripts,
  uncheckedScripts: selectUncheckedScripts,
  isAdmin: selectIsAdmin,
  customScripts: selectCustomScripts,
  imageScrapingFields: selectImageScrapingFields,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchDataWranglingScripts: promisifyRoutine(DataWranglingScriptsRoutines.fetchList),
      uploadScript: promisifyRoutine(DataWranglingScriptsRoutines.uploadScript),
      sendUpdatedDataWranglingScript: promisifyRoutine(DataWranglingScriptsRoutines.sendList),
      setScriptsList: promisifyRoutine(DataWranglingScriptsRoutines.setScripts),
      setCheckedScripts: promisifyRoutine(DataWranglingScriptsRoutines.setCheckedScripts),
    },
    dispatch
  ),
});

export default compose(
  hot(module),
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
  withRouter
)(DataWranglingScripts);
