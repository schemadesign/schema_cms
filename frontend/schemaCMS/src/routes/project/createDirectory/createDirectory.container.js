import { connect } from 'react-redux';
import { promisifyRoutine, bindPromiseCreators } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { CreateDirectory } from './createDirectory.component';
import { DirectoryRoutines } from '../../../modules/directory';

const mapStateToProps = createStructuredSelector({});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      createDirectory: promisifyRoutine(DirectoryRoutines.create),
    },
    dispatch
  );

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)(CreateDirectory);
