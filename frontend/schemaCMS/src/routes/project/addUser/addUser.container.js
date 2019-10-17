import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import { compose } from 'ramda';

import { AddUser } from './addUser.component';
import { selectNotInProjectUsers } from '../../../modules/project/project.selectors';
import { ProjectRoutines } from '../../../modules/project';

const mapStateToProps = createStructuredSelector({
  users: selectNotInProjectUsers,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchNotInProjectUsers: ProjectRoutines.fetchNotInProjectUsers,
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
)(AddUser);
