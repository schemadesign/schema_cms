import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import Helmet from 'react-helmet';

import { SourceForm } from '../../../shared/components/sourceForm';
import { TopHeader } from '../../../shared/components/topHeader';
import messages from './createDataSource.messages';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DATA_SOURCE_SCHEMA } from '../../../modules/dataSource/dataSource.constants';
import { StepNavigation } from '../../../shared/components/stepNavigation';
import { errorMessageParser } from '../../../shared/utils/helpers';

export class CreateDataSource extends PureComponent {
  static propTypes = {
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
    const { createDataSource, match } = this.props;
    const { projectId } = match.params;

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

  render() {
    const { intl, ...restProps } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Formik enableReinitialize validationSchema={DATA_SOURCE_SCHEMA} onSubmit={this.handleSubmit}>
          {({ values, submitForm, dirty, isValid, isSubmitting, ...rest }) => {
            if (!dirty && isValid) {
              submitForm = null;
            }
            const disabled = { next: !values.fileName || !isValid || isSubmitting };

            return (
              <Fragment>
                <SourceForm intl={intl} values={values} {...rest} />
                <StepNavigation
                  dataSource={{}}
                  loading={isSubmitting}
                  disabled={disabled}
                  submitForm={submitForm}
                  {...restProps}
                />
              </Fragment>
            );
          }}
        </Formik>
      </Fragment>
    );
  }
}
