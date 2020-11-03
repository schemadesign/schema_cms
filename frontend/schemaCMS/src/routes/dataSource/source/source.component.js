import React, { Fragment, PureComponent } from 'react';
import { always, ifElse, isEmpty, pipe, is, path, complement } from 'ramda';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';

import { Form, Link, Button } from './source.styles';
import messages from './source.messages';
import {
  DATA_SOURCE_GOOGLE_SHEET,
  DATA_SOURCE_RUN_LAST_JOB,
  SOURCE_TYPE_GOOGLE_SHEET,
} from '../../../modules/dataSource/dataSource.constants';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { ModalActions, Modal, ModalTitle, modalStyles } from '../../../shared/components/modal/modal.styles';
import { LinkContainer } from '../../../theme/typography';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { SourceForm } from '../../../shared/components/sourceForm';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions } from '../../project/project.constants';
import reportError from '../../../shared/utils/reportError';

export class Source extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }),
    }),
    removeDataSource: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    uploadingDataSources: PropTypes.array.isRequired,
    userRole: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,
    onDataSourceChange: PropTypes.func.isRequired,
  };

  state = {
    confirmationRemoveModalOpen: false,
    confirmationRunJobModalOpen: false,
    removeLoading: false,
  };

  handleOpenModal = modalState => this.setState({ [modalState]: true });

  handleCloseModal = modalState => this.setState({ [modalState]: false });

  handleConfirmRemove = async () => {
    try {
      this.setState({ removeLoading: true });
      const {
        dataSource: {
          project: { id: projectId },
          id: dataSourceId,
        },
      } = this.props;

      await this.props.removeDataSource({ projectId, dataSourceId });
    } catch (error) {
      this.setState({ removeLoading: false });
      reportError(error);
    }
  };

  handleShowRunModal = () => e => {
    const { dataSource, values } = this.props;
    const isFakeJob = pipe(
      path(['activeJob', 'scripts']),
      ifElse(isEmpty, always(true), complement(is(Array)))
    )(dataSource);

    const isSpreadsheetChanged =
      values.type === SOURCE_TYPE_GOOGLE_SHEET &&
      values[DATA_SOURCE_GOOGLE_SHEET] !== dataSource[DATA_SOURCE_GOOGLE_SHEET];

    if ((values.file || isSpreadsheetChanged) && !isFakeJob) {
      e.preventDefault();
      this.handleOpenModal('confirmationRunJobModalOpen');
    }
  };

  handleRunLastJob = runLastJob => () => {
    this.handleCloseModal('confirmationRunJobModalOpen');
    this.props.setFieldValue(DATA_SOURCE_RUN_LAST_JOB, runLastJob);

    setTimeout(() => {
      this.props.handleSubmit();
    });
  };

  renderLinks = renderWhenTrue(
    always(
      <LinkContainer>
        <Link to={`/datasource/${getMatchParam(this.props, 'dataSourceId')}/job`}>
          <FormattedMessage {...messages.pastVersions} />
        </Link>
        <Button id="removeDataSourceDesktopBtn" onClick={() => this.handleOpenModal('confirmationRemoveModalOpen')}>
          <FormattedMessage {...messages.removeDataSource} />
        </Button>
      </LinkContainer>
    )
  );

  render() {
    const { dataSource, intl, handleSubmit, dirty, isSubmitting, values, userRole, isValid, ...restProps } = this.props;
    const { confirmationRemoveModalOpen, confirmationRunJobModalOpen, removeLoading } = this.state;
    const headerTitle = this.props.dataSource.name;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
    const menuOptions = getProjectMenuOptions(dataSource.project.id);

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <DataSourceNavigation {...this.props} />
        </ContextHeader>
        <Form onSubmit={handleSubmit}>
          <Fragment>
            <SourceForm
              intl={intl}
              dataSource={dataSource}
              values={values}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit}
              dirty={dirty}
              {...restProps}
            />
            {this.renderLinks(!!dataSource.id)}
            <NavigationContainer right fixed padding="10px 0 70px">
              <NextButton
                type="submit"
                onClick={this.handleShowRunModal()}
                disabled={!isValid || isSubmitting || !dirty}
                loading={isSubmitting}
              >
                <FormattedMessage {...messages.save} />
              </NextButton>
            </NavigationContainer>
          </Fragment>
        </Form>
        <DataSourceNavigation {...this.props} hideOnDesktop />
        <Modal isOpen={confirmationRemoveModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={() => this.handleCloseModal('confirmationRemoveModalOpen')} disabled={removeLoading}>
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton
              id="confirmRemoveDataSource"
              onClick={this.handleConfirmRemove}
              loading={removeLoading}
              disabled={removeLoading}
            >
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
        <Modal isOpen={confirmationRunJobModalOpen} contentLabel="Confirm Run Last Job" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.runLastJobTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton id="declineRunLastJob" type="button" onClick={this.handleRunLastJob(false)}>
              <FormattedMessage {...messages.cancelRunLastJob} />
            </BackButton>
            <NextButton id="confirmRunLastJob" type="button" onClick={this.handleRunLastJob(true)}>
              <FormattedMessage {...messages.confirmRunLastJob} />
            </NextButton>
          </ModalActions>
        </Modal>
      </Fragment>
    );
  }
}
