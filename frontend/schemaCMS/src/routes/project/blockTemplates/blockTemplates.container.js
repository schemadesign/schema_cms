import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { BlockTemplates } from './blockTemplates.component';
import { BlockTemplatesRoutines, selectBlockTemplates } from '../../../modules/blockTemplates';

const mapStateToProps = createStructuredSelector({
  blockTemplates: selectBlockTemplates,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchBlocks: promisifyRoutine(BlockTemplatesRoutines.fetchBlocks),
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
  withRouter
)(BlockTemplates);
