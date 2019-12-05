import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import { always } from 'ramda';

import { UserProfile } from '../../shared/components/userProfile/userProfile.component';
import { TopHeader } from '../../shared/components/topHeader';
import { ContextHeader } from '../../shared/components/contextHeader';
import messages from './settings.messages';
import {
  AUTH_METHODS,
  INITIAL_VALUES,
  USER_PROFILE_FORM,
  USER_PROFILE_SCHEMA,
} from '../../modules/userProfile/userProfile.constants';
import { Link, LinkContainer } from '../../theme/typography';
import { BackButton, NavigationContainer, NextButton } from '../../shared/components/navigation';
import { Form } from './settings.styles';
import { renderWhenTrue } from '../../shared/utils/rendering';
import { errorMessageParser } from '../../shared/utils/helpers';

export class Settings extends PureComponent {
  static propTypes = {
    updateMe: PropTypes.func.isRequired,
    userData: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setSubmitting(true);
      await this.props.updateMe(values);
    } catch (errors) {
      const errorMessages = errorMessageParser({ errors });
      setErrors(errorMessages);
    } finally {
      setSubmitting(false);
    }
  };

  handleBack = () => {
    this.props.history.goBack();
  };

  renderResetPasswordLink = renderWhenTrue(
    always(
      <LinkContainer>
        <Link onClick={() => this.props.history.push('/reset-password')}>
          <FormattedMessage {...messages.resetPassword} />
        </Link>
      </LinkContainer>
    )
  );

  renderContent = ({ dirty, handleSubmit, isSubmitting, ...restProps }) => {
    return (
      <Form onSubmit={handleSubmit}>
        <UserProfile {...restProps} isCurrentUser />
        {this.renderResetPasswordLink(this.props.userData.authMethod === AUTH_METHODS.EMAIL)}
        <NavigationContainer fixed>
          <BackButton type="button" onClick={this.handleBack} />
          <NextButton type="submit" loading={isSubmitting} disabled={!dirty || isSubmitting}>
            <FormattedMessage {...messages.save} />
          </NextButton>
        </NavigationContainer>
      </Form>
    );
  };

  render() {
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Formik
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
      </Fragment>
    );
  }
}
