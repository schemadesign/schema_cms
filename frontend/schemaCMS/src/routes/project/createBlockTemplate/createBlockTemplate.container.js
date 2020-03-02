import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { CreateBlockTemplate } from './createBlockTemplate.component';
import { selectUserRole } from '../../../modules/userProfile';
import { BlockTemplatesRoutines } from '../../../modules/blockTemplates';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      createBlockTemplate: promisifyRoutine(BlockTemplatesRoutines.createBlockTemplate),
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
)(CreateBlockTemplate);
