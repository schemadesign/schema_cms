import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { PageBlockList } from './pageBlockList.component';
import { PageBlockRoutines, selectPageBlocks } from '../../../modules/pageBlock';
import { PageRoutines, selectPage } from '../../../modules/page';
import { selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  pageBlocks: selectPageBlocks,
  page: selectPage,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchPageBlocks: promisifyRoutine(PageBlockRoutines.fetchList),
      setPageBlocks: promisifyRoutine(PageBlockRoutines.setBlocks),
      fetchPage: promisifyRoutine(PageRoutines.fetchOne),
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
)(PageBlockList);
