import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import { compose } from 'ramda';

import { List } from './list.component';
import { ProjectRoutines } from '../../../modules/project';
import { selectProjectsList } from '../../../modules/project/project.selectors';

const mapStateToProps = createStructuredSelector({
  list: selectProjectsList,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchProjectsList: ProjectRoutines.fetchList,
    },
    dispatch
  );

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl,
  withRouter
)(List);
