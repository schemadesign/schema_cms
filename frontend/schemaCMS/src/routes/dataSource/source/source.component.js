import React, { Fragment, PureComponent } from 'react';
import { always, pathEq } from 'ramda';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';

import { Form, Link } from './source.styles';
import messages from './source.messages';
import { DATA_SOURCE_RUN_LAST_JOB } from '../../../modules/dataSource/dataSource.constants';
import { getMatchParam } from '../../../shared/utils/helpers';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import browserHistory from '../../../shared/utils/history';
import { ModalActions, Modal, ModalTitle, modalStyles } from '../../../shared/components/modal/modal.styles';
import { LinkContainer } from '../../../theme/typography';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { SourceForm } from '../../../shared/components/sourceForm';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';

export class Source extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }),
    }),
    isSubmitting: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    removeDataSource: PropTypes.func.isRequired,
    onDataSourceChange: PropTypes.func.isRequired,
  };

  state = {
    confirmationRemoveModalOpen: false,
    confirmationRunJobModalOpen: false,
  };

  handleOpenModal = modalState => this.setState({ [modalState]: true });

  handleCloseModal = modalState => this.setState({ [modalState]: false });

  handleConfirmRemove = () => {
    const {
      dataSource: {
        project: { id: projectId },
        id: dataSourceId,
      },
    } = this.props;

    this.props.removeDataSource({ projectId, dataSourceId });
  };

  handleShowRunModal = () => e => {
    const isFakeJob = pathEq(['dataSource', 'activeJob', 'scripts'], [], this.props);

    if (this.props.values.file && !isFakeJob) {
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
    const { dataSource, intl, handleSubmit, dirty, isSubmitting, values, ...restProps } = this.props;
    const { confirmationRemoveModalOpen, confirmationRunJobModalOpen } = this.state;
    const headerTitle = this.props.dataSource.name;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} projectId={dataSource.project.id} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <DataSourceNavigation {...this.props} />
        </ContextHeader>
        <Form onSubmit={handleSubmit}>
          <Fragment>
            <SourceForm intl={intl} dataSource={dataSource} values={values} {...restProps} />
            {this.renderLinks(!!dataSource.id)}
            <NavigationContainer right fixed padding="40px 0 70px">
              <NextButton
                type="submit"
                onClick={this.handleShowRunModal()}
                disabled={!values.fileName || isSubmitting || !dirty}
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
