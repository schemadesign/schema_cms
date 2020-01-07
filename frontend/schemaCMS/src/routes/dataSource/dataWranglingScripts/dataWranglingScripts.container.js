import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import {
  DataWranglingScriptsRoutines,
  selectDataWranglingScripts,
  selectCustomScripts,
  selectImageScrapingFields,
} from '../../../modules/dataWranglingScripts';
import { DataWranglingScripts } from './dataWranglingScripts.component';
import { selectDataSource } from '../../../modules/dataSource';
import { selectIsAdmin } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  dataSource: selectDataSource,
  dataWranglingScripts: selectDataWranglingScripts,
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
)(DataWranglingScripts);
