import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { find, path, prop, propEq } from 'ramda';
import { Formik } from 'formik';

import {
  NEW_USER_ROLES_OPTIONS,
  USER_CREATE_PROJECT_FORM,
  USER_CREATE_PROJECT_SCHEME,
  USER_ROLE,
} from '../../../../modules/user/user.constants';
import { ROLES } from '../../../../modules/userProfile/userProfile.constants';
import { UserCreate } from '..';
import { errorMessageParser } from '../../../utils/helpers';
import reportError from '../../../utils/reportError';
import { LoadingWrapper } from '../../loadingWrapper';

export class UserCreateProject extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    createUserProject: PropTypes.func.isRequired,
    fetchProject: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    clearUser: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    error: null,
    loading: true,
  };

  async componentDidMount() {
    try {
      const { match } = this.props;
      this.props.clearUser();

      const projectId = path(['params', 'projectId'], match);
      const userId = path(['params', 'userId'], match);

      if (userId && projectId) {
        await this.props.fetchUser({ userId });
        await this.props.fetchProject({ projectId });
      }

      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleSubmit = () => {
    const {
      project: { id: projectId },
      createUserProject,
      intl,
    } = this.props;

    return async ({ id: userId }, { setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);

        await createUserProject({ projectId, userId });
      } catch (errors) {
        const { formatMessage } = intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    };
  };

  renderContent = () => {
    const { project, user, userRole } = this.props;

    const headerValues = {
      project: project.title,
      user: `${user.firstName || ''} ${user.lastName || ''}`,
    };

    return (
      <Formik
        isInitialValid
        enableReinitialize={false}
        displayName={USER_CREATE_PROJECT_FORM}
        validationSchema={USER_CREATE_PROJECT_SCHEME}
        onSubmit={this.handleSubmit()}
        initialValues={{
          ...this.props.user,
          [USER_ROLE]: prop('label')(find(propEq('value', ROLES.EDITOR), NEW_USER_ROLES_OPTIONS)),
        }}
      >
        {({ handleSubmit, ...restProps }) => (
          <UserCreate
            handleSubmit={handleSubmit}
            headerValues={headerValues}
            cancelUrl={`/project/${this.props.project.id}/user/add`}
            userRole={userRole}
            {...restProps}
          />
        )}
      </Formik>
    );
  };

  render() {
    const { error, loading } = this.state;

    return (
      <LoadingWrapper loading={loading} error={error}>
        {this.renderContent}
      </LoadingWrapper>
    );
  }
}
