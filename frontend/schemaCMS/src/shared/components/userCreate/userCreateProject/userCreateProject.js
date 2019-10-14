import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { find, isEmpty, prop, propEq } from 'ramda';
import { Formik } from 'formik';

import browserHistory from '../../../utils/history';
import {
  NEW_USER_ROLES_OPTIONS,
  USER_CREATE_CMS_FORM,
  USER_CREATE_PROJECT_SCHEME,
  USER_ROLE,
} from '../../../../modules/user/user.constants';
import { ROLES } from '../../../../modules/userProfile/userProfile.constants';
import { UserCreate } from '../userCreateComponent/userCreate.component';

export class UserCreateProject extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    isFetched: PropTypes.bool.isRequired,
    createUserProject: PropTypes.func.isRequired,
    fetchProject: PropTypes.func.isRequired,
    clearProject: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const { match } = this.props;
    this.props.clearProject();

    if (match && match.params && match.params.projectId) {
      this.props.fetchProject({ projectId: match.params.projectId });
    }
  }

  componentDidUpdate(prevProps) {
    const { isFetched, project } = this.props;

    if (prevProps.isFetched !== isFetched && isFetched && isEmpty(project)) {
      browserHistory.push('/');
    }
  }

  handleSubmit = values => this.props.createUserProject(values);

  render() {
    const { project, user } = this.props;
    const headerValues = {
      project: project.title,
      user: `${user.firstName} ${user.lastName}`,
    };

    return (
      <Formik
        isInitialValid
        enableReinitialize={false}
        displayName={USER_CREATE_CMS_FORM}
        validationSchema={USER_CREATE_PROJECT_SCHEME}
        onSubmit={this.handleSubmit}
        initialValues={{
          ...this.props.user,
          [USER_ROLE]: prop('label')(find(propEq('value', ROLES.EDITOR), NEW_USER_ROLES_OPTIONS)),
        }}
        render={({ handleSubmit, ...restProps }) => (
          <UserCreate handleSubmit={handleSubmit} headerValues={headerValues} {...restProps} />
        )}
      />
    );
  }
}
