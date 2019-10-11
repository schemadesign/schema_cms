import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { FormattedMessage } from 'react-intl';
import { find, isEmpty, prop, propEq } from 'ramda';

import browserHistory from '../../utils/history';
import { Container, Form } from './userCreate.styles';
import {
  USER_CREATE_CMS_FORM,
  USER_CREATE_CMS_SCHEME,
  USER_CREATE_PROJECT_SCHEME,
  NEW_USER_ROLES_OPTIONS,
  USER_ROLE,
} from '../../../modules/user/user.constants';
import { renderWhenTrue, renderWhenTrueOtherwise } from '../../utils/rendering';
import { TextInput } from '../form/inputs/textInput';
import { EMAIL, FIRST_NAME, LAST_NAME, ROLES } from '../../../modules/userProfile/userProfile.constants';
import { Select } from '../form/select';
import { BackButton, NavigationContainer, NextButton } from '../navigation';

import messages from './userCreate.messages';
import { TopHeader } from '../topHeader';

export class UserCreate extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    headerValues: PropTypes.object,
    isInvitation: PropTypes.bool,
    values: PropTypes.object.isRequired,
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
        <BackButton onClick={this.handleCancelClick}>
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

export class UserCreateProject extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    isFetched: PropTypes.bool.isRequired,
    createUserProject: PropTypes.func.isRequired,
    fetchProject: PropTypes.func.isRequired,
    clearProject: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const { match } = this.props;
    this.props.clearProject();

    if (match && match.params && match.params.projectId) {
      this.props.fetchProject({ projectId: match.params.projectId });
    }
  }

  componentDidUpdate(prevProps) {
    const { isFetched, project } = this.props;

    if (prevProps.isFetched !== isFetched && isFetched && isEmpty(project)) {
      browserHistory.push('/');
    }
  }

  handleSubmit = values => this.props.createUserProject(values);

  render() {
    const { project, user } = this.props;
    const headerValues = {
      project: project.title,
      user: `${user.firstName} ${user.lastName}`,
    };

    return (
      <Formik
        isInitialValid
        enableReinitialize={false}
        displayName={USER_CREATE_CMS_FORM}
        validationSchema={USER_CREATE_PROJECT_SCHEME}
        onSubmit={this.handleSubmit}
        initialValues={{
          ...this.props.user,
          [USER_ROLE]: prop('label')(find(propEq('value', ROLES.EDITOR), NEW_USER_ROLES_OPTIONS)),
        }}
        render={({ handleSubmit, ...restProps }) => (
          <UserCreate handleSubmit={handleSubmit} headerValues={headerValues} {...restProps} />
        )}
      />
    );
  }
}
