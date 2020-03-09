import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { BlockTemplate } from './blockTemplate.component';
import { BlockTemplatesRoutines, selectBlockTemplate, selectBlockTemplates } from '../../modules/blockTemplates';
import { selectUserRole } from '../../modules/userProfile';
import { selectProject } from '../../modules/project';

const mapStateToProps = createStructuredSelector({
  blockTemplate: selectBlockTemplate,
  blockTemplates: selectBlockTemplates,
  userRole: selectUserRole,
  project: selectProject,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchBlockTemplate: promisifyRoutine(BlockTemplatesRoutines.fetchBlockTemplate),
      updateBlockTemplate: promisifyRoutine(BlockTemplatesRoutines.updateBlockTemplate),
      fetchBlockTemplates: promisifyRoutine(BlockTemplatesRoutines.fetchBlockTemplates),
      removeBlockTemplate: promisifyRoutine(BlockTemplatesRoutines.removeBlockTemplate),
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
)(BlockTemplate);
