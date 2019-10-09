import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import { Container } from './userCreate.styles';
import { USER_CREATE_CMS_FORM, USER_CREATE_CMS_SCHEME } from '../../../modules/user/user.constants';

export class UserCreate extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Container>
        <form onSubmit={this.props.handleSubmit}>UserCreate component</form>
      </Container>
    );
  }
}

export class UserCreateCMS extends PureComponent {
  static propTypes = {
    createUserCMS: PropTypes.func.isRequired,
  };

  handleSubmit = values => this.props.createUserCMS(values);

  render() {
    return (
      <Formik displayName={USER_CREATE_CMS_FORM} validationSchema={USER_CREATE_CMS_SCHEME} onSubmit={this.handleSubmit}>
        {({ handleSubmit, ...restProps }) => <UserCreate handleSubmit={handleSubmit} {...restProps} />}
      </Formik>
    );
  }
}

export class UserCreateProject extends PureComponent {
  static propTypes = {
    createUserProject: PropTypes.func.isRequired,
  };

  handleSubmit = values => this.props.createUserProject(values);

  render() {
    return (
      <Formik displayName={USER_CREATE_CMS_FORM} validationSchema={USER_CREATE_CMS_SCHEME} onSubmit={this.handleSubmit}>
        {({ handleSubmit, ...restProps }) => <UserCreate handleSubmit={handleSubmit} {...restProps} />}
      </Formik>
    );
  }
}
