import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { BlockList } from './blockList.component';
import { BlockRoutines, selectBlocks } from '../../../modules/block';
import { PageRoutines, selectPage } from '../../../modules/page';

const mapStateToProps = createStructuredSelector({
  blocks: selectBlocks,
  page: selectPage,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchBlocks: promisifyRoutine(BlockRoutines.fetchList),
      setBlocks: promisifyRoutine(BlockRoutines.setBlocks),
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
)(BlockList);
