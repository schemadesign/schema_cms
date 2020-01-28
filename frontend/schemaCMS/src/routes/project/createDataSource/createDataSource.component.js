import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import Helmet from 'react-helmet';

import { SourceForm } from '../../../shared/components/sourceForm';
import messages from './createDataSource.messages';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DATA_SOURCE_SCHEMA } from '../../../modules/dataSource/dataSource.constants';
import { errorMessageParser, getMatchParam, filterMenuOptions } from '../../../shared/utils/helpers';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions } from '../project.constants';

export class CreateDataSource extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string,
    intl: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    createDataSource: PropTypes.func.isRequired,
  };

  handleSubmit = async (requestData, { setErrors, setSubmitting }) => {
    const { createDataSource } = this.props;
    const projectId = getMatchParam(this.props, 'projectId');

    try {
      setSubmitting(true);
      await createDataSource({ requestData, projectId });
    } catch (errors) {
      const { formatMessage } = this.props.intl;
      const errorMessages = errorMessageParser({ errors, messages, formatMessage });

      setErrors(errorMessages);
    } finally {
      setSubmitting(false);
    }
  };

  handleCancelCreate = () => this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}/datasource`);

  render() {
    const { intl, userRole } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
    const projectId = getMatchParam(this.props, 'projectId');
    const menuOptions = getProjectMenuOptions(projectId);

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Formik
          enableReinitialize
          initialValues={{ fileName: '' }}
          validationSchema={DATA_SOURCE_SCHEMA}
          onSubmit={this.handleSubmit}
        >
          {({ values, submitForm, dirty, isValid, isSubmitting, ...rest }) => {
            if (!dirty && isValid) {
              submitForm = null;
            }

            return (
              <Fragment>
                <SourceForm intl={intl} values={values} {...rest} />
                <NavigationContainer fixed>
                  <BackButton onClick={this.handleCancelCreate}>
                    <FormattedMessage {...messages.cancel} />
                  </BackButton>
                  <NextButton
                    onClick={submitForm}
                    disabled={!values.fileName || !isValid || isSubmitting}
                    loading={isSubmitting}
                  >
                    <FormattedMessage {...messages.save} />
                  </NextButton>
                </NavigationContainer>
              </Fragment>
            );
          }}
        </Formik>
      </Fragment>
    );
  }
}
