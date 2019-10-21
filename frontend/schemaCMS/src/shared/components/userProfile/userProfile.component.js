import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import { Container } from './userProfile.styles';
import { TextInput } from '../form/inputs/textInput';
import {
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

export class UserProfile extends PureComponent {
  static propTypes = {
    userData: PropTypes.object.isRequired,
    updateMe: PropTypes.func,
    makeAdmin: PropTypes.func,
    intl: PropTypes.object.isRequired,
    isSettings: PropTypes.bool,
    match: PropTypes.object,
    history: PropTypes.object,
  };

  static defaultProps = {
    isSettings: false,
  };

  handleGoToList = () => this.props.history.push('/user');

  handleSubmit = values => {
    if (this.props.isSettings) {
      return this.props.updateMe(values);
    }

    return this.props.makeAdmin({ userId: this.props.match.params.userId });
  };

  renderMakeAdmin = renderWhenTrue(() => (
    <NextButton type="submit">{this.props.intl.formatMessage(messages.makeAdmin)}</NextButton>
  ));

  renderSubmitButton = ({ dirty, isEditor }) =>
    renderWhenTrueOtherwise(
      () => (
        <NextButton type="submit" disabled={!dirty}>
          {this.props.intl.formatMessage(messages.save)}
        </NextButton>
      ),
      () => (
        <Fragment>
          <BackButton type="button" onClick={this.handleGoToList} />
          {this.renderMakeAdmin(isEditor)}
        </Fragment>
      )
    );

  renderRole = ({ values, roleLabel, restProps }) =>
    renderWhenTrue(() => <TextInput fullWidth value={values[ROLE]} name={ROLE} label={roleLabel} {...restProps} />);

  renderContent = ({ values, handleChange, handleSubmit, dirty, ...restProps }) => {
    const { intl, isSettings } = this.props;
    const firstNameLabel = intl.formatMessage(messages.firstNameLabel);
    const lastNameLabel = intl.formatMessage(messages.lastNameLabel);
    const emailLabel = intl.formatMessage(messages.emailLabel);
    const roleLabel = intl.formatMessage(messages.roleLabel);
    const isEditor = this.props.userData.role === ROLES.EDITOR;

    return (
      <Container>
        <form onSubmit={handleSubmit}>
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
            {this.renderSubmitButton({ dirty, isEditor })(isSettings)}
          </NavigationContainer>
        </form>
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
