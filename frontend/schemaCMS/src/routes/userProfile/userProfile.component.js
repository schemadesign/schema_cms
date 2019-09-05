import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container, Form } from './userProfile.styles';
import { TopHeader } from '../../shared/components/topHeader';
import { TextInput } from '../../shared/components/form/inputs/textInput';
import { EMAIL, FIRST_NAME, LAST_NAME } from '../../modules/userProfile/userProfile.constants';

import messages from './userProfile.messages';

export class UserProfile extends PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  getHeaderAndMenuConfig = intl => ({
    headerTitle: intl.formatMessage(messages.title),
    headerSubtitle: intl.formatMessage(messages.subTitle),
  });

  render() {
    const { values, handleChange, handleSubmit, intl } = this.props;
    const firstNameLabel = intl.formatMessage(messages.firstNameLabel);
    const lastNameLabel = intl.formatMessage(messages.lastNameLabel);
    const emailLabel = intl.formatMessage(messages.emailLabel);
    const topHeaderConfig = this.getHeaderAndMenuConfig(intl);

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
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
