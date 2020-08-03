import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { always, cond, identity, path, propEq, T } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { renderWhenTrue } from '../../../shared/utils/rendering';
import { filterMenuOptions, generateApiUrl, getMatchParam } from '../../../shared/utils/helpers';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { SETTINGS } from '../../../shared/components/projectTabs/projectTabs.constants';
import messages from './view.messages';
import {
  Container,
  DetailItem,
  DetailLabel,
  Details,
  DetailValue,
  DetailWrapper,
  ProjectView,
  inputStyles,
  containerInputStyles,
  selectContainerStyles,
  InputContainer,
} from './view.styles';
import { BackArrowButton, BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';

import { Modal, ModalActions, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
import { Link, LinkContainer } from '../../../theme/typography';
import { getProjectMenuOptions, PROJECT_DETAILS_ID } from '../project.constants';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { Select } from '../../../shared/components/form/select';
import {
  PROJECT_DESCRIPTION,
  PROJECT_DOMAIN,
  PROJECT_OWNER,
  PROJECT_STATUS,
  PROJECT_STATUSES_LIST,
  PROJECT_TITLE,
} from '../../../modules/project/project.constants';
import { StatisticCards } from '../../../shared/components/statisticCards';

export class View extends PureComponent {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    fetchProject: PropTypes.func.isRequired,
    removeProject: PropTypes.func.isRequired,
    userRole: PropTypes.string,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    removeLoading: false,
    confirmationModalOpen: false,
    publishConfirmationModalOpen: false,
  };

  getStatusOptions = intl =>
    PROJECT_STATUSES_LIST.map(status => ({
      value: status,
      label: intl.formatMessage(messages[status]),
    }));

  formatMessage = value => this.props.intl.formatMessage(value);

  handleGoTo = to => () => (to ? this.props.history.push(to) : null);

  handleDeleteClick = () => this.setState({ confirmationModalOpen: true });

  handleConfirmRemove = async () => {
    try {
      this.setState({ removeLoading: true });

      await this.props.removeProject({ projectId: this.props.project.id });
    } catch (error) {
      this.setState({ removeLoading: false });
      reportError(error);
    }
  };

  handleCancelRemove = () => this.setState({ confirmationModalOpen: false });

  handleCancelPublish = () => this.setState({ publishConfirmationModalOpen: false });

  handleSelectStatus = setFieldValue => ({ value: selectedStatus }) => {
    setFieldValue(PROJECT_STATUS, selectedStatus);
  };

  handleSelect = () => this.handleSelectStatus(this.props.setFieldValue);

  handleConfirmPublish = () => {
    this.props.setFieldValue(PROJECT_STATUS, 'published');
    this.setState({
      publishConfirmationModalOpen: false,
    });
  };

  handleStatusSelect = ({ value }) => {
    if (value === 'published') {
      return this.setState({
        publishConfirmationModalOpen: true,
      });
    }

    return this.props.setFieldValue(PROJECT_STATUS, value);
  };

  renderInput = ({ field, multiline }) => (
    <InputContainer>
      <TextInput
        value={this.props.values[field]}
        name={field}
        onChange={this.props.handleChange}
        customInputStyles={inputStyles}
        customStyles={containerInputStyles}
        isEdit
        fullWidth
        multiline={multiline}
        {...this.props}
      />
    </InputContainer>
  );

  renderSelect = ({ field, onSelect = this.handleSelect }) => (
    <Select
      customStyles={selectContainerStyles}
      name={field}
      value={this.props.values[field]}
      options={this.getStatusOptions(this.props.intl)}
      onSelect={onSelect}
    />
  );

  renderValue = ({ id, value, field }) => (
    <DetailValue id={`${id}Value`}>{value || this.props.project[field] || ''}</DetailValue>
  );

  renderDetailValue = cond([
    [propEq('isAdmin', false), this.renderValue],
    [propEq('select', true), this.renderSelect],
    [propEq('editable', true), this.renderInput],
    [T, this.renderValue],
  ]);

  renderDetail = ({ id, label, order, fullWidth, onSelect = identity, ...rest }, index) => (
    <DetailItem order={order} key={index} fullWidth={fullWidth}>
      <DetailWrapper id={id}>
        <DetailLabel id={`${id}Label`}>{label}</DetailLabel>
        {this.renderDetailValue({ id, ...rest, isAdmin: this.props.isAdmin, onSelect })}
      </DetailWrapper>
    </DetailItem>
  );

  renderProject = ({ id: projectId, owner, slug, created, meta, status } = {}) => {
    const statistics = [
      {
        header: messages.dataSources,
        value: meta.dataSources,
        to: `/project/${projectId}/datasource`,
        id: 'projectDataSources',
      },
      {
        header: messages.pages,
        value: meta.pages,
        to: `/project/${projectId}/content`,
        id: 'projectPages',
      },
      {
        header: messages.users,
        value: meta.users,
        to: `/project/${projectId}/user`,
        id: 'projectUsers',
      },
    ];

    const { firstName = '—', lastName = '' } = owner || {};

    const statusValue = messages[status] ? this.formatMessage(messages[status]) : status;
    const data = [
      {
        label: this.formatMessage(messages.titleField),
        field: PROJECT_TITLE,
        id: 'fieldTitle',
        order: 2,
        mobileOrder: 1,
        editable: true,
      },
      {
        label: this.formatMessage(messages.description),
        field: PROJECT_DESCRIPTION,
        id: 'fieldDescription',
        order: 7,
        mobileOrder: 2,
        editable: true,
        multiline: true,
        fullWidth: true,
      },
      {
        label: this.formatMessage(messages.status),
        field: PROJECT_STATUS,
        value: statusValue,
        id: 'fieldStatus',
        order: 4,
        mobileOrder: 3,
        editable: true,
        select: true,
        onSelect: this.handleStatusSelect,
      },
      {
        label: this.formatMessage(messages.domainField),
        field: PROJECT_DOMAIN,
        id: 'fieldDomain',
        order: 6,
        mobileOrder: 4,
        editable: true,
      },
      {
        label: this.formatMessage(messages.lastUpdate),
        field: 'created',
        value: extendedDayjs(created, BASE_DATE_FORMAT).fromNow(),
        id: 'fieldLastUpdated',
        order: 1,
        mobileOrder: 5,
      },
      {
        label: this.formatMessage(messages.owner),
        field: PROJECT_OWNER,
        value: `${firstName} ${lastName}`,
        id: 'fieldOwner',
        order: 3,
        mobileOrder: 6,
      },

      {
        label: this.formatMessage(messages.api),
        field: 'slug',
        value: generateApiUrl(slug),
        id: 'fieldSlug',
        order: 5,
        mobileOrder: 7,
      },
    ];

    return (
      <ProjectView>
        <StatisticCards statistics={statistics} history={this.props.history} />
        <Details>{data.map(this.renderDetail)}</Details>
      </ProjectView>
    );
  };

  renderRemoveProjectButton = renderWhenTrue(
    always(
      <LinkContainer>
        <Link id="deleteProjectDesktopBtn" onClick={this.handleDeleteClick}>
          <FormattedMessage {...messages.deleteProject} />
        </Link>
      </LinkContainer>
    )
  );

  renderSaveButton = isAdmin =>
    renderWhenTrue(
      always(
        <NextButton
          onClick={this.props.handleSubmit}
          loading={this.props.isSubmitting}
          disabled={!this.props.dirty || this.props.isSubmitting || !this.props.isValid}
          type="button"
        >
          <FormattedMessage {...messages.save} />
        </NextButton>
      )
    )(isAdmin);

  render() {
    const { project, userRole, isAdmin } = this.props;
    const { confirmationModalOpen, removeLoading, publishConfirmationModalOpen } = this.state;
    const headerSubtitle = path(['title'], project, <FormattedMessage {...messages.subTitle} />);
    const headerTitle = <FormattedMessage {...messages.title} />;
    const projectId = getMatchParam(this.props, 'projectId');
    const menuOptions = getProjectMenuOptions(projectId);

    return (
      <Container>
        <div>
          <Helmet title={this.formatMessage(messages.pageTitle)} />
          <MobileMenu
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
            options={filterMenuOptions(menuOptions, userRole)}
            active={PROJECT_DETAILS_ID}
          />
          <ProjectTabs active={SETTINGS} url={`/project/${projectId}`} />
          <Fragment>
            {this.renderProject(project)}
            {this.renderRemoveProjectButton(isAdmin)}
          </Fragment>
        </div>
        <NavigationContainer fixed>
          <BackArrowButton id="backProjectBtn" onClick={this.handleGoTo('/project')} />
          {this.renderSaveButton(isAdmin)}
        </NavigationContainer>
        <Modal
          id="projectConfirmationRemovalModal"
          isOpen={confirmationModalOpen}
          contentLabel="Confirm Removal"
          style={modalStyles}
        >
          <ModalTitle id="projectConfirmationRemovalModalTitle">
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton
              id="projectConfirmationRemovalModalCancelBtn"
              onClick={this.handleCancelRemove}
              disabled={removeLoading}
            >
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton
              id="projectConfirmationRemovalModalConfirmBtn"
              onClick={this.handleConfirmRemove}
              loading={removeLoading}
              disabled={removeLoading}
            >
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
        <Modal
          id="projectPublishConfirmationRemovalModal"
          isOpen={publishConfirmationModalOpen}
          contentLabel="Confirm Publish"
          style={modalStyles}
        >
          <ModalTitle id="projectPublishConfirmationRemovalModalTitle">
            <FormattedMessage {...messages.publishTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton
              id="projectConfirmationPublishModalCancelBtn"
              onClick={this.handleCancelPublish}
              disabled={removeLoading}
            >
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton
              id="projectPublishConfirmationRemovalModalConfirmBtn"
              onClick={this.handleConfirmPublish}
              loading={removeLoading}
              disabled={removeLoading}
            >
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
      </Container>
    );
  }
}
