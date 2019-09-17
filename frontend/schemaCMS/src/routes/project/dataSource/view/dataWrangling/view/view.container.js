import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { DataWranglingRoutines, selectDataWrangling } from '../../../../../../modules/dataWrangling';
import { View } from './view.component';

const mapStateToProps = createStructuredSelector({
  dataWrangling: selectDataWrangling,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchDataWrangling: promisifyRoutine(DataWranglingRoutines.fetchOne),
      unmountDataWrangling: promisifyRoutine(DataWranglingRoutines.unmountOne),
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
