import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import { compose } from 'ramda';

import { View } from './view.component';
import { ProjectActions, ProjectRoutines } from '../../../modules/project';
import { selectProject } from '../../../modules/project/project.selectors';
import { selectUserData } from '../../../modules/userProfile/userProfile.selectors';

const mapStateToProps = createStructuredSelector({
  user: selectUserData,
  project: selectProject,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchProject: ProjectRoutines.fetchOne,
      unmountProject: ProjectActions.unmountOne,
      removeProject: ProjectRoutines.removeOne,
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
)(View);
