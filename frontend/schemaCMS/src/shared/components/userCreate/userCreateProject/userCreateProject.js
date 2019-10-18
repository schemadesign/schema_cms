import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { find, path, prop, propEq } from 'ramda';
import { Formik } from 'formik';
import { FormattedMessage } from 'react-intl';

import browserHistory from '../../../utils/history';
import {
  NEW_USER_ROLES_OPTIONS,
  USER_CREATE_PROJECT_FORM,
  USER_CREATE_PROJECT_SCHEME,
  USER_ROLE,
} from '../../../../modules/user/user.constants';
import { ROLES } from '../../../../modules/userProfile/userProfile.constants';
import { UserCreate } from '../userCreateComponent/userCreate.component';
import { renderWhenTrueOtherwise } from '../../../utils/rendering';
import { Loading } from './userCreateProject.styles';

import messages from './userCreateProject.messages';

export class UserCreateProject extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    createUserProject: PropTypes.func.isRequired,
    fetchProject: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    clearProject: PropTypes.func.isRequired,
    clearUser: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
  };

  async componentDidMount() {
    try {
      const { match } = this.props;
      this.props.clearProject();
      this.props.clearUser();

      const projectId = path(['params', 'projectId'], match);
      const userId = path(['params', 'userId'], match);

      if (userId && projectId) {
        await this.props.fetchUser({ userId });
        await this.props.fetchProject({ projectId });
      }
    } catch (e) {
      browserHistory.push('/');
    }
  }

  handleSubmit = ({ id: userId }) => {
    const projectId = this.props.project.id;
    this.props.createUserProject({ projectId, userId });
  };

  renderLoading = renderWhenTrueOtherwise(
    () => (
      <Loading>
        <FormattedMessage {...messages.loading} />
      </Loading>
    ),
    () => {
      const { project, user } = this.props;

      const headerValues = {
        project: project.title,
        user: `${user.firstName} ${user.lastName}`,
      };

      return (
        <Formik
          isInitialValid
          enableReinitialize={false}
          displayName={USER_CREATE_PROJECT_FORM}
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
  );

  render() {
    const { project, user } = this.props;
    return this.renderLoading(!project.id || !user.id);
  }
}
