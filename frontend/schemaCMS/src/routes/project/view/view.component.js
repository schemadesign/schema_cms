import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { always, cond, isEmpty, path, propEq, T } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { renderWhenTrue } from '../../../shared/utils/rendering';
import { filterMenuOptions, generateApiUrl, getMatchParam } from '../../../shared/utils/helpers';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import reportError from '../../../shared/utils/reportError';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
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
import { PROJECT_STATUS, PROJECT_STATUSES_LIST } from '../../../modules/project/project.constants';
import { StatisticCards } from '../../../shared/components/statisticCards';

export class View extends PureComponent {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
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
    loading: true,
    removeLoading: false,
    error: null,
    confirmationModalOpen: false,
  };

  async componentDidMount() {
    try {
      await this.props.fetchProject(this.props.match.params);
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

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

  handleSelectStatus = setFieldValue => ({ value: selectedStatus }) => {
    setFieldValue(PROJECT_STATUS, selectedStatus);
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

  renderSelect = ({ field }) => (
    <Select
      customStyles={selectContainerStyles}
      name={field}
      value={this.props.values[field]}
      options={this.getStatusOptions(this.props.intl)}
      onSelect={this.handleSelectStatus(this.props.setFieldValue)}
    />
  );

  renderValue = ({ id, value, field }) => (
    <DetailValue id={`${id}Value`}>{value || this.props.project[field] || ''}</DetailValue>
  );

  renderDetailValue = cond([
    [propEq('select', true), this.renderSelect],
    [propEq('editable', true), this.renderInput],
    [T, this.renderValue],
  ]);

  renderDetail = ({ id, label, order, ...rest }, index) => (
    <DetailItem order={order} key={index}>
      <DetailWrapper id={id}>
        <DetailLabel id={`${id}Label`}>{label}</DetailLabel>
        {this.renderDetailValue({ id, ...rest })}
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
        header: messages.states,
        value: meta.states,
        to: `/project/${projectId}/state`,
        id: 'projectStates',
      },
      {
        header: messages.pages,
        value: meta.pages,
        to: `/project/${projectId}/folder`,
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
        label: this.formatMessage(messages.lastUpdate),
        field: 'created',
        value: extendedDayjs(created, BASE_DATE_FORMAT).fromNow(),
        id: 'fieldLastUpdated',
        order: 1,
      },
      {
        label: this.formatMessage(messages.status),
        field: 'status',
        value: statusValue,
        id: 'fieldStatus',
        order: 3,
        editable: true,
        select: true,
      },
      {
        label: this.formatMessage(messages.owner),
        field: 'owner',
        value: `${firstName} ${lastName}`,
        id: 'fieldOwner',
        order: 5,
      },
      { label: this.formatMessage(messages.titleField), field: 'title', id: 'fieldTitle', order: 2, editable: true },
      {
        label: this.formatMessage(messages.description),
        field: 'description',
        id: 'fieldDescription',
        order: 4,
        editable: true,
        multiline: true,
      },
      {
        label: this.formatMessage(messages.api),
        field: 'slug',
        value: generateApiUrl(slug),
        id: 'fieldSlug',
        order: 6,
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

  renderContent = loading =>
    renderWhenTrue(() => (
      <Fragment>
        {this.renderProject(this.props.project)}
        {this.renderRemoveProjectButton(this.props.isAdmin)}
      </Fragment>
    ))(!loading);

  render() {
    const { project, userRole, handleSubmit, dirty, isSubmitting } = this.props;
    const { confirmationModalOpen, error, loading, removeLoading } = this.state;
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
          <LoadingWrapper loading={loading} noData={isEmpty(project)} error={error}>
            {this.renderContent(loading)}
          </LoadingWrapper>
        </div>
        <NavigationContainer fixed>
          <BackArrowButton id="backProjectBtn" onClick={this.handleGoTo('/project')} />
          <NextButton onClick={handleSubmit} loading={isSubmitting} disabled={!dirty || isSubmitting} type="button">
            <FormattedMessage {...messages.save} />
          </NextButton>
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
      </Container>
    );
  }
}
