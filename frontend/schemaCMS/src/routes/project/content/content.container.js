import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { Content } from './content.component';
import { selectUserRole } from '../../../modules/userProfile';
import { SectionsRoutines, selectSections } from '../../../modules/sections';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  sections: selectSections,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchSections: promisifyRoutine(SectionsRoutines.fetchSections),
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
)(Content);
