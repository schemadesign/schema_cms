import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { USER_CREATE_CMS_FORM, USER_CREATE_CMS_SCHEME, USER_ROLE } from '../../../../modules/user/user.constants';
import { UserCreate } from '../userCreateComponent/userCreate.component';
import { EMAIL, FIRST_NAME, LAST_NAME, ROLES } from '../../../../modules/userProfile/userProfile.constants';
import browserHistory from '../../../utils/history';

export class UserCreateCMS extends PureComponent {
  static propTypes = {
    createUserCMS: PropTypes.func.isRequired,
  };

  handleSubmit = values => this.props.createUserCMS(values);

  handleCancelClick = () => {
    browserHistory.push('/user');
  };

  render() {
    return (
      <Formik
        displayName={USER_CREATE_CMS_FORM}
        validationSchema={USER_CREATE_CMS_SCHEME}
        onSubmit={this.handleSubmit}
        initialValues={{
          [USER_ROLE]: ROLES.ADMIN,
          [FIRST_NAME]: '',
          [LAST_NAME]: '',
          [EMAIL]: '',
        }}
        enableReinitialize
        render={({ handleSubmit, ...restProps }) => (
          <UserCreate handleSubmit={handleSubmit} onCancelClick={this.handleCancelClick} isInvitation {...restProps} />
        )}
      />
    );
  }
}
