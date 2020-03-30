import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { TextInput } from '../form/inputs/textInput';
import { EMAIL, FIRST_NAME, LAST_NAME, ROLE } from '../../../modules/userProfile/userProfile.constants';

import messages from './userProfile.messages';

export class UserProfile extends PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func,
    isCurrentUser: PropTypes.bool,
  };

  static defaultProps = {
    isCurrentUser: false,
    handleChange: () => {},
  };

  render() {
    const { values, isCurrentUser, handleChange, ...restProps } = this.props;
    const firstNameLabel = <FormattedMessage {...messages.firstNameLabel} />;
    const lastNameLabel = <FormattedMessage {...messages.lastNameLabel} />;
    const emailLabel = <FormattedMessage {...messages.emailLabel} />;
    const roleLabel = <FormattedMessage {...messages.roleLabel} />;

    return (
      <Fragment>
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
        <TextInput disabled fullWidth value={values[EMAIL]} onChange={handleChange} name={EMAIL} label={emailLabel} />
        <TextInput disabled fullWidth value={values[ROLE]} name={ROLE} label={roleLabel} {...restProps} />
      </Fragment>
    );
  }
}
