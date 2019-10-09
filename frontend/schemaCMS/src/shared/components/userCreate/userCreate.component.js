import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { FormattedMessage } from 'react-intl';
import { find, prop, propEq } from 'ramda';

import { Container, Form } from './userCreate.styles';
import {
  USER_CREATE_CMS_FORM,
  USER_CREATE_CMS_SCHEME,
  NEW_USER_ROLES_OPTIONS,
  USER_ROLE,
} from '../../../modules/user/user.constants';
import { renderWhenTrue, renderWhenTrueOtherwise } from '../../utils/rendering';
import { TextInput } from '../form/inputs/textInput';
import { EMAIL, FIRST_NAME, LAST_NAME, ROLES } from '../../../modules/userProfile/userProfile.constants';
import { Select } from '../form/select';
import { BackButton, NavigationContainer, NextButton } from '../navigation';

import messages from './userCreate.messages';

export class UserCreate extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    isInvitation: PropTypes.bool,
    values: PropTypes.object.isRequired,
  };

  static defaultProps = {
    isInvitation: false,
  };

  handleSelectStatus = ({ value }) => this.props.setFieldValue(USER_ROLE, value);

  renderNameField = renderWhenTrue(() => {
    const fullName = `${this.props.values[FIRST_NAME]} ${this.props.values[LAST_NAME]}`;
    return <TextInput label="Name" value={fullName} readOnly name={FIRST_NAME} />;
  });

  renderSelectOrText = renderWhenTrueOtherwise(
    () => (
      <Select
        label="Select Role"
        name={USER_ROLE}
        value={this.props.values[USER_ROLE]}
        options={NEW_USER_ROLES_OPTIONS}
        onSelect={this.handleSelectStatus}
      />
    ),
    () => <TextInput label="Role" value={this.props.values[USER_ROLE]} readOnly name={USER_ROLE} />
  );

  renderNavigation = isInvitation => {
    const invitationLabel = isInvitation ? { ...messages.invite } : { ...messages.add };

    return (
      <NavigationContainer>
        <BackButton onClick={this.handleCancelClick}>
          <FormattedMessage {...messages.cancel} />
        </BackButton>
        <NextButton type="submit">
          <FormattedMessage {...invitationLabel} />
        </NextButton>
      </NavigationContainer>
    );
  };

  render() {
    const { isInvitation, values, handleChange } = this.props;

    return (
      <Container>
        <Form onSubmit={this.props.handleSubmit}>
          {this.renderNameField(isInvitation)}
          <TextInput label="Email" value={values[EMAIL]} onChange={handleChange} name={EMAIL} />
          {this.renderSelectOrText(isInvitation)}
          {this.renderNavigation(isInvitation)}
        </Form>
      </Container>
    );
  }
}

export class UserCreateCMS extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    createUserCMS: PropTypes.func.isRequired,
  };

  handleSubmit = values => this.props.createUserCMS(values);

  render() {
    return (
      <Formik
        displayName={USER_CREATE_CMS_FORM}
        validationSchema={USER_CREATE_CMS_SCHEME}
        onSubmit={this.handleSubmit}
        initialValues={{ ...this.props.user }}
      >
        {({ handleSubmit, ...restProps }) => <UserCreate handleSubmit={handleSubmit} {...restProps} isInvitation />}
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
      <Formik
        displayName={USER_CREATE_CMS_FORM}
        validationSchema={USER_CREATE_CMS_SCHEME}
        onSubmit={this.handleSubmit}
        initialValues={{
          [USER_ROLE]: prop('label')(find(propEq('value', ROLES.EDITOR), NEW_USER_ROLES_OPTIONS)),
        }}
      >
        {({ handleSubmit, ...restProps }) => <UserCreate handleSubmit={handleSubmit} {...restProps} />}
      </Formik>
    );
  }
}
