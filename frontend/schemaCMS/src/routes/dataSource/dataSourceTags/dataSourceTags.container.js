import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { DataSourceTags } from './dataSourceTags.component';
import { selectTagCategories, TagCategoryRoutines } from '../../../modules/tagCategory';
import { selectProject } from '../../../modules/project';
import { selectDataSource } from '../../../modules/dataSource';
import { selectUserRole } from '../../../modules/userProfile';
import { DataSourceTagsRoutines } from '../../../modules/dataSourceTags';

const mapStateToProps = createStructuredSelector({
  tagCategories: selectTagCategories,
  project: selectProject,
  dataSource: selectDataSource,
  userRole: selectUserRole,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchTagCategories: promisifyRoutine(TagCategoryRoutines.fetchTagCategories),
      fetchDataSourceTags: promisifyRoutine(DataSourceTagsRoutines.fetchDataSourceTags),
      updateDataSourceTags: promisifyRoutine(DataSourceTagsRoutines.updateDataSourceTags),
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
)(DataSourceTags);
