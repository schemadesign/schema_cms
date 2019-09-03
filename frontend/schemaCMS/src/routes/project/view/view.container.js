import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import { compose } from 'ramda';

import { View } from './view.component';
import { ProjectActions } from '../../../modules/project';
import { selectProject } from '../../../modules/project/project.selectors';

const mapStateToProps = createStructuredSelector({
  project: selectProject,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchProject: ProjectActions.fetchOne,
      unmountProject: ProjectActions.unmountOne,
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
