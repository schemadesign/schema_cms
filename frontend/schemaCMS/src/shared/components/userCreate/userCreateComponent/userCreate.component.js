import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Container, Form } from './userCreate.styles';
import { NEW_USER_ROLES_OPTIONS, USER_ROLE } from '../../../../modules/user/user.constants';
import { renderWhenTrueOtherwise } from '../../../utils/rendering';
import { TextInput } from '../../form/inputs/textInput';
import { EMAIL, FIRST_NAME, LAST_NAME } from '../../../../modules/userProfile/userProfile.constants';
import { Select } from '../../form/select';
import { BackLink, NavigationContainer, NextButton } from '../../navigation';
import { ContextHeader } from '../../contextHeader';

import messages from './userCreate.messages';
import { filterMenuOptions } from '../../../utils/helpers';
import { USER_MENU_OPTIONS } from '../../../../routes/user/user.constants';
import { MobileMenu } from '../../menu/mobileMenu';

export class UserCreate extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    isValid: PropTypes.bool.isRequired,
    headerValues: PropTypes.object,
    isInvitation: PropTypes.bool,
    isSubmitting: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired,
    cancelUrl: PropTypes.string.isRequired,
  };

  static defaultProps = {
    isInvitation: false,
    headerValues: {
      project: '',
      user: '',
    },
  };

  getHeaderAndMenuConfig = ({ project, user }) =>
    renderWhenTrueOtherwise(
      () => ({
        headerTitle: <FormattedMessage {...messages.pageTitle} />,
        headerSubtitle: <FormattedMessage {...messages.pageSubTitle} />,
      }),
      () => ({
        headerTitle: <FormattedMessage {...messages.pageTitle} />,
        headerSubtitle: <FormattedMessage {...messages.addUser} values={{ project, user }} />,
      })
    );

  handleSelectStatus = ({ value }) => this.props.setFieldValue(USER_ROLE, value);

  renderSelectOrText = renderWhenTrueOtherwise(
    () => (
      <Select
        fullWidth
        label="Select Role"
        name={USER_ROLE}
        value={this.props.values[USER_ROLE]}
        options={NEW_USER_ROLES_OPTIONS}
        onSelect={this.handleSelectStatus}
      />
    ),
    () => <TextInput fullWidth label="Role" value={this.props.values[USER_ROLE]} disabled name={USER_ROLE} />
  );

  renderNavigation = isInvitation => {
    const invitationLabel = isInvitation ? { ...messages.invite } : { ...messages.add };

    return (
      <NavigationContainer fixed>
        <BackLink id="inviteUserBackBtn" to={this.props.cancelUrl}>
          <FormattedMessage {...messages.cancel} />
        </BackLink>
        <NextButton
          id="inviteUserSubmitBtn"
          type="submit"
          loading={this.props.isSubmitting}
          disabled={!this.props.isValid || this.props.isSubmitting}
        >
          <FormattedMessage {...invitationLabel} />
        </NextButton>
      </NavigationContainer>
    );
  };

  renderEmailField = renderWhenTrueOtherwise(
    () => <TextInput fullWidth label="Email" name={EMAIL} onChange={this.props.handleChange} isEdit {...this.props} />,
    () => (
      <TextInput
        fullWidth
        label="Email"
        value={this.props.values[EMAIL]}
        name={EMAIL}
        onChange={this.props.handleChange}
        disabled
      />
    )
  );

  render() {
    const { isInvitation, headerValues, userRole, ...restProps } = this.props;
    const headerConfig = this.getHeaderAndMenuConfig(headerValues)(isInvitation);

    return (
      <Container>
        <MobileMenu
          headerTitle={headerConfig.headerTitle}
          headerSubtitle={headerConfig.headerSubtitle}
          options={filterMenuOptions(USER_MENU_OPTIONS, userRole)}
        />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        <Form onSubmit={this.props.handleSubmit}>
          <TextInput
            fullWidth
            label="Name"
            name={FIRST_NAME}
            value={this.props.values[FIRST_NAME]}
            onChange={this.props.handleChange}
            disabled={!isInvitation}
            isEdit={isInvitation}
            {...restProps}
          />
          <TextInput
            fullWidth
            label="Last name"
            name={LAST_NAME}
            value={this.props.values[LAST_NAME]}
            onChange={this.props.handleChange}
            disabled={!isInvitation}
            isEdit={isInvitation}
            {...restProps}
          />
          {this.renderEmailField(isInvitation)}
          {this.renderSelectOrText(isInvitation)}
          {this.renderNavigation(isInvitation)}
        </Form>
      </Container>
    );
  }
}
