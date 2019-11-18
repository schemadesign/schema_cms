import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { always, ifElse, is, path, equals } from 'ramda';
import Modal from 'react-modal';
import { FormattedMessage } from 'react-intl';

import { Container, Form } from './userProfile.styles';
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
import { isDesktop } from '../../../theme/media';
import { getModalStyles, ModalActions, ModalButton, ModalTitle } from '../modal/modal.styles';
import { Link, LinkContainer } from '../../../theme/typography';

export class UserProfile extends PureComponent {
  static propTypes = {
    userData: PropTypes.object.isRequired,
    updateMe: PropTypes.func,
    makeAdmin: PropTypes.func,
    removeUser: PropTypes.func,
    removeUserFromProject: PropTypes.func,
    isAdmin: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    isCurrentUser: PropTypes.bool,
    match: PropTypes.object,
    history: PropTypes.object.isRequired,
  };

  static defaultProps = {
    isAdmin: false,
    isCurrentUser: false,
  };

  state = {
    userRemoveModalOpen: false,
    projectId: path(['match', 'params', 'projectId'])(this.props),
  };

  getBackUrl = ifElse(is(String), projectId => `/project/${projectId}/user`, () => '/user');
  getRemoveModalMessage = ifElse(equals(true), always('removeTitleFromProject'), always('removeTitle'));
  getRemoveCopyMessage = ifElse(equals(true), always('removeUserFromProject'), always('removeUser'));

  handleGoToList = () => {
    if (this.props.isCurrentUser && isDesktop()) {
      this.props.history.goBack();
    } else {
      this.props.history.push(this.getBackUrl(this.state.projectId));
    }
  };

  handleSubmit = values => {
    if (this.props.isCurrentUser) {
      return this.props.updateMe(values);
    }

    return this.props.makeAdmin({ userId: path(['match', 'params', 'userId'], this.props) });
  };

  handleCancelRemove = () => this.setState({ userRemoveModalOpen: false });

  handleConfirmRemove = () => {
    const userId = path(['userData', 'id'], this.props);
    const { projectId } = this.state;

    if (projectId) {
      return this.props.removeUserFromProject({ projectId, userId });
    }

    return this.props.removeUser({ userId });
  };

  renderMakeAdmin = renderWhenTrue(() => (
    <NextButton type="submit">{this.props.intl.formatMessage(messages.makeAdmin)}</NextButton>
  ));

  renderSubmitButton = ({ dirty, isEditor, isAdmin, projectId }) =>
    renderWhenTrueOtherwise(
      () => (
        <NextButton type="submit" disabled={!dirty}>
          {this.props.intl.formatMessage(messages.save)}
        </NextButton>
      ),
      () => this.renderMakeAdmin(isEditor && isAdmin && !projectId)
    );

  renderRole = ({ values, roleLabel, restProps }) =>
    renderWhenTrue(() => (
      <TextInput disabled fullWidth value={values[ROLE]} name={ROLE} label={roleLabel} {...restProps} />
    ));

  renderLink = renderWhenTrueOtherwise(
    always(
      <LinkContainer>
        <Link onClick={() => this.props.history.push('/reset-password')}>
          <FormattedMessage {...messages.resetPassword} />
        </Link>
      </LinkContainer>
    ),
    always(
      <LinkContainer>
        <Link onClick={() => this.setState({ userRemoveModalOpen: true })}>
          <FormattedMessage {...messages[this.getRemoveCopyMessage(!!this.state.projectId)]} />
        </Link>
      </LinkContainer>
    )
  );

  renderContent = ({ values, handleChange, handleSubmit, dirty, ...restProps }) => {
    const {
      intl,
      isCurrentUser,
      isAdmin,
      userData: { email },
    } = this.props;
    const { projectId } = this.state;
    const firstNameLabel = intl.formatMessage(messages.firstNameLabel);
    const lastNameLabel = intl.formatMessage(messages.lastNameLabel);
    const emailLabel = intl.formatMessage(messages.emailLabel);
    const roleLabel = intl.formatMessage(messages.roleLabel);
    const isEditor = this.props.userData.role === ROLES.EDITOR;

    return (
      <Container>
        <Form onSubmit={handleSubmit}>
          <TextInput
            disabled={!isCurrentUser}
            isEdit={isCurrentUser}
            fullWidth
            value={values[FIRST_NAME]}
            onChange={handleChange}
            name={FIRST_NAME}
            label={firstNameLabel}
            {...restProps}
          />
          <TextInput
            disabled={!isCurrentUser}
            isEdit={isCurrentUser}
            fullWidth
            value={values[LAST_NAME]}
            onChange={handleChange}
            name={LAST_NAME}
            label={lastNameLabel}
            {...restProps}
          />
          <TextInput disabled fullWidth value={email} onChange={handleChange} name={EMAIL} label={emailLabel} />
          {this.renderRole({ values, roleLabel, restProps })(!isCurrentUser)}
          {this.renderLink(isCurrentUser)}
          <Modal isOpen={this.state.userRemoveModalOpen} contentLabel="Confirm Removal" style={getModalStyles()}>
            <ModalTitle>
              <FormattedMessage {...messages[this.getRemoveModalMessage(!!projectId)]} />
            </ModalTitle>
            <ModalActions>
              <ModalButton onClick={this.handleCancelRemove}>
                <FormattedMessage {...messages.cancelRemoval} />
              </ModalButton>
              <ModalButton onClick={this.handleConfirmRemove}>
                <FormattedMessage {...messages.confirmRemoval} />
              </ModalButton>
            </ModalActions>
          </Modal>
          <NavigationContainer>
            <BackButton type="button" onClick={this.handleGoToList} />
            {this.renderSubmitButton({ dirty, isEditor, isAdmin, projectId })(isCurrentUser)}
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
