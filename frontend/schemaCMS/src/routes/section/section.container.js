import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { Section } from './section.component';
import { SectionsRoutines } from '../../modules/sections';

const mapStateToProps = createStructuredSelector({});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchSection: promisifyRoutine(SectionsRoutines.fetchSection),
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
)(Section);
