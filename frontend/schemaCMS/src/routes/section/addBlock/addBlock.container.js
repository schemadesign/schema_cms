import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { AddBlock } from './addBlock.component';
import { BlockTemplatesRoutines, selectBlockTemplates } from '../../../modules/blockTemplates';
import { selectProject } from '../../../modules/project';
import { selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  blockTemplates: selectBlockTemplates,
  project: selectProject,
  userRole: selectUserRole,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchBlockTemplates: promisifyRoutine(BlockTemplatesRoutines.fetchBlockTemplates),
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
)(AddBlock);
