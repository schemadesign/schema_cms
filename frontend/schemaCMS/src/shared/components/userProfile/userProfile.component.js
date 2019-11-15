import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { ifElse, is, path } from 'ramda';

import { Container, Form } from './userProfile.styles';
import { TextInput } from '../form/inputs/textInput';
import {
  ME,
  EMAIL,
  FIRST_NAME,
  INITIAL_VALUES,
  LAST_NAME,
  ROLE,
  ROLES,
  USER_PROFILE_FORM,
  USER_PROFILE_SCHEMA,
} from '../../../modules/userProfile/userProfile.constants';

import messages from './userProfile.messages';
import { renderWhenTrue, renderWhenTrueOtherwise } from '../../utils/rendering';
import { BackButton, NavigationContainer, NextButton } from '../navigation';
import { isDesktop } from '../../../theme/media';

export class UserProfile extends PureComponent {
  static propTypes = {
    userData: PropTypes.object.isRequired,
    updateMe: PropTypes.func,
    makeAdmin: PropTypes.func,
    isAdmin: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    isSettings: PropTypes.bool,
    match: PropTypes.object,
    history: PropTypes.object,
  };

  static defaultProps = {
    isSettings: false,
    isAdmin: false,
  };

  getBackUrl = ifElse(is(String), projectId => `/project/${projectId}/user`, () => '/user');

  handleGoToList = () => {
    const id = path(['match', 'params', 'userId'], this.props);

    if (id === ME && isDesktop()) {
      this.props.history.goBack();
    } else {
      this.props.history.push(this.getBackUrl(path(['match', 'params', 'projectId'])(this.props)));
    }
  };

  handleSubmit = values => {
    if (this.props.isSettings) {
      return this.props.updateMe(values);
    }

    return this.props.makeAdmin({ userId: path(['match', 'params', 'userId'], this.props) });
  };

  renderMakeAdmin = renderWhenTrue(() => (
    <NextButton type="submit">{this.props.intl.formatMessage(messages.makeAdmin)}</NextButton>
  ));

  renderSubmitButton = ({ dirty, isEditor, isAdmin }) =>
    renderWhenTrueOtherwise(
      () => (
        <NextButton type="submit" disabled={!dirty}>
          {this.props.intl.formatMessage(messages.save)}
        </NextButton>
      ),
      () => (
        <Fragment>
          <BackButton type="button" onClick={this.handleGoToList} />
          {this.renderMakeAdmin(isEditor && isAdmin)}
        </Fragment>
      )
    );

  renderRole = ({ values, roleLabel, restProps }) =>
    renderWhenTrue(() => (
      <TextInput disabled fullWidth value={values[ROLE]} name={ROLE} label={roleLabel} {...restProps} />
    ));

  renderContent = ({ values, handleChange, handleSubmit, dirty, ...restProps }) => {
    const { intl, isSettings, isAdmin } = this.props;
    const firstNameLabel = intl.formatMessage(messages.firstNameLabel);
    const lastNameLabel = intl.formatMessage(messages.lastNameLabel);
    const emailLabel = intl.formatMessage(messages.emailLabel);
    const roleLabel = intl.formatMessage(messages.roleLabel);
    const isEditor = this.props.userData.role === ROLES.EDITOR;

    return (
      <Container>
        <Form onSubmit={handleSubmit}>
          <TextInput
            disabled={!isSettings}
            fullWidth
            value={values[FIRST_NAME]}
            onChange={handleChange}
            name={FIRST_NAME}
            label={firstNameLabel}
            {...restProps}
          />
          <TextInput
            disabled={!isSettings}
            fullWidth
            value={values[LAST_NAME]}
            onChange={handleChange}
            name={LAST_NAME}
            label={lastNameLabel}
            {...restProps}
          />
          <TextInput disabled fullWidth readOnly value={values[EMAIL]} name={EMAIL} label={emailLabel} />
          {this.renderRole({ values, roleLabel, restProps })(!isSettings)}
          <NavigationContainer right={isSettings || isEditor}>
            {this.renderSubmitButton({ dirty, isEditor, isAdmin })(isSettings)}
          </NavigationContainer>
        </Form>
      </Container>
    );
  };

  render() {
    return (
      <Formik
        isInitialValid
        enableReinitialize
        displayName={USER_PROFILE_FORM}
        validationSchema={USER_PROFILE_SCHEMA}
        onSubmit={this.handleSubmit}
        initialValues={{
          ...INITIAL_VALUES,
          ...this.props.userData,
        }}
        render={this.renderContent}
      />
    );
  }
}
