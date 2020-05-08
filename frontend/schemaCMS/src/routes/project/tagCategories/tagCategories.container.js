import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { TagCategories } from './tagCategories.component';
import { selectUserRole } from '../../../modules/userProfile';
import { TagCategoryRoutines, selectTagCategories } from '../../../modules/tagCategory';
import { selectProject } from '../../../modules/project';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  project: selectProject,
  tagCategories: selectTagCategories,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchTagCategories: promisifyRoutine(TagCategoryRoutines.fetchTagCategories),
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
)(TagCategories);
