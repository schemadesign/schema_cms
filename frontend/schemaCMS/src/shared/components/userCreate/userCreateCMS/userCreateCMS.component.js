import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { USER_CREATE_CMS_FORM, USER_CREATE_CMS_SCHEME } from '../../../../modules/user/user.constants';
import { UserCreate } from '../userCreateComponent/userCreate.component';

export class UserCreateCMS extends PureComponent {
  static propTypes = {
    createUserCMS: PropTypes.func.isRequired,
  };

  handleSubmit = values => this.props.createUserCMS(values);

  render() {
    return (
      <Formik
        displayName={USER_CREATE_CMS_FORM}
        validationSchema={USER_CREATE_CMS_SCHEME}
        onSubmit={this.handleSubmit}
        render={({ handleSubmit, ...restProps }) => (
          <UserCreate handleSubmit={handleSubmit} {...restProps} isInvitation />
        )}
      />
    );
  }
}
