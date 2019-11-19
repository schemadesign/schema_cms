import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { DataWranglingScriptsRoutines, selectDataWranglingScript } from '../../modules/dataWranglingScripts';
import { DataWranglingScript } from './dataWranglingScript.component';
import { selectIsAdmin } from '../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  dataWranglingScript: selectDataWranglingScript,
  isAdmin: selectIsAdmin,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchDataWranglingScript: promisifyRoutine(DataWranglingScriptsRoutines.fetchOne),
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
