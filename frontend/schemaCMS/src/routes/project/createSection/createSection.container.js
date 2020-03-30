import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { CreateSection } from './createSection.component';
import { selectUserRole } from '../../../modules/userProfile';
import { SectionsRoutines } from '../../../modules/sections';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      createSection: promisifyRoutine(SectionsRoutines.createSection),
    },
    dispatch
  ),
});

export default compose(hot(module), connect(mapStateToProps, mapDispatchToProps), withRouter)(CreateSection);
