import React, { Fragment, PureComponent } from 'react';
import { always, omit, path } from 'ramda';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import { withTheme } from 'styled-components';
import Helmet from 'react-helmet';

import { Link } from './source.styles';
import messages from './source.messages';
import { DATA_SOURCE_SCHEMA, IGNORED_FIELDS } from '../../../modules/dataSource/dataSource.constants';
import { errorMessageParser } from '../../../shared/utils/helpers';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import browserHistory from '../../../shared/utils/history';
import { ModalActions, Modal, ModalTitle, modalStyles } from '../../../shared/components/modal/modal.styles';
import { LinkContainer } from '../../../theme/typography';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { SourceForm } from '../../../shared/components/sourceForm';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';

export class SourceComponent extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object,
    intl: PropTypes.object.isRequired,
    removeDataSource: PropTypes.func,
    theme: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string,
      }).isRequired,
    }).isRequired,
    onDataSourceChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    dataSource: {},
  };

  state = {
    confirmationModalOpen: false,
  };

  handleRemoveClick = () => this.setState({ confirmationModalOpen: true });

  handleCancelRemove = () => this.setState({ confirmationModalOpen: false });

  handleConfirmRemove = () => {
    const {
      dataSource: { project: projectId, id: dataSourceId },
    } = this.props;

    this.props.removeDataSource({ projectId, dataSourceId });
  };

  handleSubmit = async (requestData, { setErrors, setSubmitting }) => {
    const { onDataSourceChange, match } = this.props;
    const { dataSourceId, projectId, step } = match.params;

    try {
      setSubmitting(true);
      await onDataSourceChange({ requestData, dataSourceId, step, projectId });
    } catch (errors) {
      const { formatMessage } = this.props.intl;
      const errorMessages = errorMessageParser({ errors, messages, formatMessage });

      setErrors(errorMessages);
    } finally {
      setSubmitting(false);
    }
  };

  handlePastVersionsClick = () =>
    browserHistory.push(`/datasource/${path(['match', 'params', 'dataSourceId'], this.props)}/job`);

  renderLinks = renderWhenTrue(
    always(
      <LinkContainer>
        <Link onClick={this.handlePastVersionsClick}>
          <FormattedMessage {...messages.pastVersions} />
        </Link>
        <Link id="removeDataSourceDesktopBtn" onClick={this.handleRemoveClick}>
          <FormattedMessage {...messages.removeDataSource} />
        </Link>
      </LinkContainer>
    )
  );

  render() {
    const { dataSource, intl } = this.props;
    const { confirmationModalOpen } = this.state;
    const headerTitle = this.props.dataSource.name;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <DataSourceNavigation {...this.props} />
        </ContextHeader>
        <Formik
          enableReinitialize
          isInitialValid={!!dataSource.fileName}
          initialValues={omit(IGNORED_FIELDS, dataSource)}
          validationSchema={DATA_SOURCE_SCHEMA}
          onSubmit={this.handleSubmit}
        >
          {({ values, submitForm, dirty, isValid, isSubmitting, ...rest }) => {
            if (!dirty && isValid) {
              submitForm = null;
            }

            return (
              <Fragment>
                <SourceForm intl={intl} dataSource={dataSource} values={values} {...rest} />
                {this.renderLinks(!!dataSource.id)}
                <NavigationContainer right>
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
        <DataSourceNavigation {...this.props} hideOnDesktop />
        <Modal isOpen={confirmationModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={this.handleCancelRemove}>
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton onClick={this.handleConfirmRemove}>
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
      </Fragment>
    );
  }
}

export const Source = withTheme(SourceComponent);
