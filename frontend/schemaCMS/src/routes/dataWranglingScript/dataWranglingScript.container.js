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
  selectImageScrappingFields,
} from '../../modules/dataWranglingScripts';
import { DataWranglingScript } from './dataWranglingScript.component';
import { selectIsAdmin } from '../../modules/userProfile';
import { DataSourceRoutines, selectFieldNames } from '../../modules/dataSource';

const mapStateToProps = createStructuredSelector({
  dataWranglingScript: selectDataWranglingScript,
  fieldNames: selectFieldNames,
  isAdmin: selectIsAdmin,
  imageScrappingFields: selectImageScrappingFields,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchDataWranglingScript: promisifyRoutine(DataWranglingScriptsRoutines.fetchOne),
      fetchDataSource: promisifyRoutine(DataSourceRoutines.fetchOne),
      setImageScrappingFields: promisifyRoutine(DataWranglingScriptsRoutines.setImageScrappingFields),
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
