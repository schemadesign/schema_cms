import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { USER_CREATE_CMS_FORM, USER_CREATE_CMS_SCHEME, USER_ROLE } from '../../../../modules/user/user.constants';
import { UserCreate } from '../userCreateComponent/userCreate.component';
import messages from '../userCreateComponent/userCreate.messages';
import { EMAIL, FIRST_NAME, LAST_NAME, ROLES } from '../../../../modules/userProfile/userProfile.constants';
import browserHistory from '../../../utils/history';
import { errorMessageParser } from '../../../utils/helpers';

export class UserCreateCMS extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    createUserCMS: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleSubmit = () => {
    const { createUserCMS, intl } = this.props;

    return async (data, { setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);

        await createUserCMS(data);
      } catch (errors) {
        const { formatMessage } = intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    };
  };

  handleCancelClick = () => {
    browserHistory.push('/user');
  };

  render() {
    return (
      <Formik
        displayName={USER_CREATE_CMS_FORM}
        validationSchema={USER_CREATE_CMS_SCHEME}
        onSubmit={this.handleSubmit()}
        initialValues={{
          [USER_ROLE]: ROLES.ADMIN,
          [FIRST_NAME]: '',
          [LAST_NAME]: '',
          [EMAIL]: '',
        }}
        enableReinitialize
      >
        {({ handleSubmit, ...restProps }) => (
          <UserCreate
            handleSubmit={handleSubmit}
            onCancelClick={this.handleCancelClick}
            userRole={this.props.userRole}
            isInvitation
            {...restProps}
          />
        )}
      </Formik>
    );
  }
}
