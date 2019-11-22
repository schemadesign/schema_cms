import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { PageList } from './pageList.component';
import { PageRoutines, selectPages } from '../../../modules/page';
import { DirectoryRoutines, selectDirectory } from '../../../modules/directory';

const mapStateToProps = createStructuredSelector({
  pages: selectPages,
  directory: selectDirectory,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchPages: promisifyRoutine(PageRoutines.fetchList),
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
  injectIntl,
  withRouter
)(PageList);
