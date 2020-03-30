import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import { compose } from 'ramda';

import { List } from './list.component';
import { ProjectRoutines } from '../../../modules/project';
import { selectProjectsList } from '../../../modules/project/project.selectors';
import { selectIsAdmin, selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  list: selectProjectsList,
  isAdmin: selectIsAdmin,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchProjectsList: promisifyRoutine(ProjectRoutines.fetchList),
    },
    dispatch
  );

export default compose(hot(module), connect(mapStateToProps, mapDispatchToProps), injectIntl, withRouter)(List);
