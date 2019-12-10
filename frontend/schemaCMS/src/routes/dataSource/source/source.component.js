import React, { Fragment, PureComponent } from 'react';
import { always, pathEq, pick } from 'ramda';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import { withTheme } from 'styled-components';
import Helmet from 'react-helmet';

import { Link } from './source.styles';
import messages from './source.messages';
import { DATA_SOURCE_SCHEMA, DATA_SOURCE_FIELDS } from '../../../modules/dataSource/dataSource.constants';
import { errorMessageParser, getMatchParam } from '../../../shared/utils/helpers';
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
    confirmationRemoveModalOpen: false,
    confirmationRunJobModalOpen: false,
    runModalData: {},
  };

  updateDataSource = async ({ requestData, setErrors, setSubmitting, runLastJob = false }) => {
    const { onDataSourceChange, match } = this.props;
    const { dataSourceId, projectId, step } = match.params;
    requestData.runLastJob = runLastJob;

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

  handleOpenModal = modalState => this.setState({ [modalState]: true });

  handleCloseModal = modalState => this.setState({ [modalState]: false });

  handleCancelRemove = () => this.setState({ confirmationRemoveModalOpen: false });

  handleConfirmRemove = () => {
    const {
      dataSource: { project: projectId, id: dataSourceId },
    } = this.props;

    this.props.removeDataSource({ projectId, dataSourceId });
  };

  handleRunLastJob = runLastJob => async () => {
    this.handleCloseModal('confirmationRunJobModalOpen');
    await this.updateDataSource({ ...this.state.runModalData, runLastJob });
  };

  handleSubmit = async (requestData, { setErrors, setSubmitting }) => {
    const { dataSource } = this.props;
    const formData = { requestData, setErrors, setSubmitting };
    const isFakeJob = pathEq(['activeJob', 'scripts'], [], dataSource);

    if (requestData.file && !isFakeJob) {
      this.handleOpenModal('confirmationRunJobModalOpen');
      this.setState({ runModalData: formData });
      return;
    }

    await this.updateDataSource(formData);
  };

  handlePastVersionsClick = () => browserHistory.push(`/datasource/${getMatchParam(this.props, 'dataSourceId')}/job`);

  renderLinks = renderWhenTrue(
    always(
      <LinkContainer>
        <Link onClick={this.handlePastVersionsClick}>
          <FormattedMessage {...messages.pastVersions} />
        </Link>
        <Link id="removeDataSourceDesktopBtn" onClick={() => this.handleOpenModal('confirmationRemoveModalOpen')}>
          <FormattedMessage {...messages.removeDataSource} />
        </Link>
      </LinkContainer>
    )
  );

  render() {
    const { dataSource, intl } = this.props;
    const { confirmationRemoveModalOpen, confirmationRunJobModalOpen } = this.state;
    const headerTitle = this.props.dataSource.name;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} projectId={dataSource.project} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <DataSourceNavigation {...this.props} />
        </ContextHeader>
        <Formik
          enableReinitialize
          isInitialValid={!!dataSource.fileName}
          initialValues={pick(DATA_SOURCE_FIELDS, dataSource)}
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
                    disabled={!values.fileName || isSubmitting || !dirty}
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
        <Modal isOpen={confirmationRemoveModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={() => this.handleCloseModal('confirmationRemoveModalOpen')}>
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton id="confirmRemoveDataSource" onClick={this.handleConfirmRemove}>
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
        <Modal isOpen={confirmationRunJobModalOpen} contentLabel="Confirm Run Last Job" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.runLastJobTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton id="declineRunLastJob" onClick={this.handleRunLastJob()}>
              <FormattedMessage {...messages.cancelRunLastJob} />
            </BackButton>
            <NextButton id="confirmRunLastJob" onClick={this.handleRunLastJob(true)}>
              <FormattedMessage {...messages.confirmRunLastJob} />
            </NextButton>
          </ModalActions>
        </Modal>
      </Fragment>
    );
  }
}

export const Source = withTheme(SourceComponent);
