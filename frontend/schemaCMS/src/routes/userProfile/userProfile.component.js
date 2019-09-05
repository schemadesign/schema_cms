import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Typography } from 'schemaUI';

import { Container, Form } from './userProfile.styles';
import { TextInput } from '../../shared/components/form/inputs/textInput';
import { EMAIL, FIRST_NAME, LAST_NAME } from '../../modules/userProfile/userProfile.constants';

import messages from './userProfile.messages';

const { H2, H1 } = Typography;

export class UserProfile extends PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { values, handleChange, handleSubmit, intl } = this.props;
    const firstNameLabel = intl.formatMessage(messages.firstNameLabel);
    const lastNameLabel = intl.formatMessage(messages.lastNameLabel);
    const emailLabel = intl.formatMessage(messages.emailLabel);

    return (
      <Container>
        <Header>
          <H2>Admin Settings</H2>
          <H1>Profile</H1>
        </Header>
        <Form onSubmit={handleSubmit}>
          <TextInput
            value={values[FIRST_NAME]}
            onChange={handleChange}
            name={FIRST_NAME}
            label={firstNameLabel}
            {...this.props}
          />
          <TextInput
            value={values[LAST_NAME]}
            onChange={handleChange}
            name={LAST_NAME}
            label={lastNameLabel}
            {...this.props}
          />
          <TextInput value={values[EMAIL]} onChange={handleChange} name={EMAIL} label={emailLabel} {...this.props} />
        </Form>
      </Container>
    );
  }
}
