import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { DataWranglingScriptsRoutines, selectDataWranglingScript } from '../../../modules/dataWranglingScripts';
import { View } from './view.component';

const mapStateToProps = createStructuredSelector({
  dataWrangling: selectDataWranglingScript,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchDataWrangling: promisifyRoutine(DataWranglingScriptsRoutines.fetchOne),
      unmountDataWrangling: promisifyRoutine(DataWranglingScriptsRoutines.unmountOne),
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
)(View);
