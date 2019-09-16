import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { DataSourceRoutines, selectDataWranglingDetail } from '../../../../../../modules/dataSource';
import { View } from './view.component';

const mapStateToProps = createStructuredSelector({
  dataWrangling: selectDataWranglingDetail,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchDataWrangling: promisifyRoutine(DataSourceRoutines.fetchOneDataWrangling),
      unmountDataWrangling: promisifyRoutine(DataSourceRoutines.unmountOneDataWrangling),
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
