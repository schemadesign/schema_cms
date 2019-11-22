import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { Directory } from './directory.component';
import { DirectoryRoutines } from '../../modules/directory';

const mapStateToProps = createStructuredSelector({});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchDirectory: promisifyRoutine(DirectoryRoutines.fetchOne),
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
)(Directory);
