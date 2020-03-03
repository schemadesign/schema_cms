import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { BlockTemplates } from './blockTemplates.component';
import { BlockTemplatesRoutines, selectBlockTemplates } from '../../../modules/blockTemplates';
import { selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  blockTemplates: selectBlockTemplates,
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
  injectIntl,
  withRouter
)(BlockTemplates);
