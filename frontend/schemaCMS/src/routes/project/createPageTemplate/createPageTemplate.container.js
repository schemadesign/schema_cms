import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { CreatePageTemplate } from './createPageTemplate.component';
import { selectUserRole } from '../../../modules/userProfile';
import { BlockTemplatesRoutines, selectBlockTemplates } from '../../../modules/blockTemplates';
import { PageTemplatesRoutines } from '../../../modules/pageTemplates';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  blockTemplates: selectBlockTemplates,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      createPageTemplate: promisifyRoutine(PageTemplatesRoutines.createPageTemplate),
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
)(CreatePageTemplate);
