import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import {
  DataWranglingScriptsRoutines,
  selectDataWranglingScript,
  selectImageScrapingFields,
} from '../../modules/dataWranglingScripts';
import { DataWranglingScript } from './dataWranglingScript.component';
import { selectIsAdmin } from '../../modules/userProfile';
import { DataSourceRoutines, selectFieldsWithUrls } from '../../modules/dataSource';

const mapStateToProps = createStructuredSelector({
  dataWranglingScript: selectDataWranglingScript,
  fieldWithUrls: selectFieldsWithUrls,
  isAdmin: selectIsAdmin,
  imageScrapingFields: selectImageScrapingFields,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchDataWranglingScript: promisifyRoutine(DataWranglingScriptsRoutines.fetchOne),
      fetchDataSource: promisifyRoutine(DataSourceRoutines.fetchOne),
      setImageScrapingFields: promisifyRoutine(DataWranglingScriptsRoutines.setImageScrapingFields),
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
)(DataWranglingScript);
