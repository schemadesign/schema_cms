import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Container, Form } from './userCreate.styles';
import { NEW_USER_ROLES_OPTIONS, USER_ROLE } from '../../../../modules/user/user.constants';
import { renderWhenTrue, renderWhenTrueOtherwise } from '../../../utils/rendering';
import { TextInput } from '../../form/inputs/textInput';
import { EMAIL, FIRST_NAME, LAST_NAME } from '../../../../modules/userProfile/userProfile.constants';
import { Select } from '../../form/select';
import { BackButton, NavigationContainer, NextButton } from '../../navigation';

import messages from './userCreate.messages';
import { TopHeader } from '../../topHeader';

export class UserCreate extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    headerValues: PropTypes.object,
    isInvitation: PropTypes.bool,
    values: PropTypes.object.isRequired,
    onCancelClick: PropTypes.func.isRequired,
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
        <BackButton onClick={this.props.onCancelClick}>
          <FormattedMessage {...messages.cancel} />
        </BackButton>
        <NextButton type="submit">
          <FormattedMessage {...invitationLabel} />
        </NextButton>
      </NavigationContainer>
    );
  };

  renderEmailField = renderWhenTrueOtherwise(
    () => <TextInput label="Email" onChange={this.props.handleChange} name={EMAIL} {...this.props} checkOnlyErrors />,
    () => <TextInput label="Email" value={this.props.values[EMAIL]} name={EMAIL} readOnly />
  );

  render() {
    const { isInvitation, headerValues } = this.props;

    return (
      <Container>
        <TopHeader {...this.getHeaderAndMenuConfig(headerValues)(isInvitation)} />
        <Form onSubmit={this.props.handleSubmit}>
          {this.renderNameField(!isInvitation)}
          {this.renderEmailField(isInvitation)}
          {this.renderSelectOrText(isInvitation)}
          {this.renderNavigation(isInvitation)}
        </Form>
      </Container>
    );
  }
}
