import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'schemaUI';
import { Formik } from 'formik';

import { buttonStyles, Container, Link, LinksWrapper } from './userProfile.styles';
import { TopHeader } from '../topHeader';
import { TextInput } from '../form/inputs/textInput';
import {
  EMAIL,
  FIRST_NAME,
  INITIAL_VALUES,
  LAST_NAME,
  USER_PROFILE_FORM,
  USER_PROFILE_SCHEMA,
} from '../../../modules/userProfile/userProfile.constants';

import messages from './userProfile.messages';

export class UserProfile extends PureComponent {
  static propTypes = {
    userData: PropTypes.object.isRequired,
    updateMe: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  getHeaderAndMenuConfig = intl => ({
    headerTitle: intl.formatMessage(messages.title),
    headerSubtitle: intl.formatMessage(messages.subTitle),
  });

  handleSubmit = values => {
    this.props.updateMe(values);
  };

  renderContent = ({ values, handleChange, handleSubmit, ...restProps }) => {
    const { intl } = this.props;
    const firstNameLabel = intl.formatMessage(messages.firstNameLabel);
    const lastNameLabel = intl.formatMessage(messages.lastNameLabel);
    const emailLabel = intl.formatMessage(messages.emailLabel);
    const topHeaderConfig = this.getHeaderAndMenuConfig(intl);

    return (
      <Container>
        <form onSubmit={handleSubmit}>
          <TopHeader {...topHeaderConfig} />
          <TextInput
            value={values[FIRST_NAME]}
            onChange={handleChange}
            name={FIRST_NAME}
            label={firstNameLabel}
            {...restProps}
          />
          <TextInput
            value={values[LAST_NAME]}
            onChange={handleChange}
            name={LAST_NAME}
            label={lastNameLabel}
            {...restProps}
          />
          <TextInput disabled value={values[EMAIL]} name={EMAIL} label={emailLabel} {...restProps} />

          <Button customStyles={buttonStyles}>{intl.formatMessage(messages.save)}</Button>
        </form>
        <LinksWrapper>
          <Link to="/reset-password">{intl.formatMessage(messages.resetPassword)}</Link>
          <Link to="/logout">{intl.formatMessage(messages.logout)}</Link>
        </LinksWrapper>
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
