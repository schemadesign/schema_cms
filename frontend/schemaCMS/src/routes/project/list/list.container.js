import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';

import { List } from './list.component';
import { ProjectActions } from '../../../modules/project';
import { selectProjectsList, selectProjectsMenu } from '../../../modules/project/project.selectors';

const mapStateToProps = createStructuredSelector({
  list: selectProjectsList,
  isMenuOpen: selectProjectsMenu,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchProjectsList: ProjectActions.fetchList,
      toggleMenu: ProjectActions.toggleMenu,
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
)(List);
