import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Card, Icons } from 'schemaUI';
import { has, isEmpty, isNil, path, always, cond, T } from 'ramda';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-modal';

import { generateApiUrl } from '../../../shared/utils/helpers';
import browserHistory from '../../../shared/utils/history';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { Loader } from '../../../shared/components/loader';
import { TopHeader } from '../../../shared/components/topHeader';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { SETTINGS } from '../../../shared/components/projectTabs/projectTabs.constants';
import messages from './view.messages';
import {
  Container,
  CardWrapper,
  CardHeader,
  CardValue,
  ProjectView,
  Details,
  DetailItem,
  DetailWrapper,
  DetailLabel,
  DetailValue,
  IconEditWrapper,
  Statistics,
  statisticsCardStyles,
  Link,
  LinkContainer,
} from './view.styles';
import { BackArrowButton, NavigationContainer } from '../../../shared/components/navigation';

import { getModalStyles, ModalTitle, ModalButton, ModalActions } from '../../../shared/components/modal/modal.styles';

export class View extends PureComponent {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
    fetchProject: PropTypes.func.isRequired,
    unmountProject: PropTypes.func.isRequired,
    removeProject: PropTypes.func.isRequired,
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
    confirmationModalOpen: false,
  };

  async componentDidMount() {
    try {
      await this.props.fetchProject(this.props.match.params);
    } catch (e) {
      browserHistory.push('/');
    }
  }

  componentWillUnmount() {
    return this.props.unmountProject();
  }

  getHeaderAndMenuConfig = (headerSubtitle, projectId, hasNoData) => {
    const primaryMenuItems = [];
    const secondaryMenuItems = [];

    if (!hasNoData) {
      primaryMenuItems.push({
        label: this.formatMessage(messages.dataSources),
        to: `/project/${projectId}/datasource`,
      });

      if (this.props.isAdmin) {
        secondaryMenuItems.push(
          { label: this.formatMessage(messages.editProjectSettings), to: `/project/edit/${projectId}` },
          {
            label: this.formatMessage(messages.deleteProject),
            onClick: this.handleDeleteClick,
          }
        );
      }
    }

    secondaryMenuItems.push({ label: this.formatMessage(messages.logOut), to: '/logout' });

    return {
      headerTitle: this.formatMessage(messages.title),
      headerSubtitle,
      primaryMenuItems,
      secondaryMenuItems,
    };
  };

  countItems = value => (isNil(value) ? null : value.length);

  formatMessage = value => this.props.intl.formatMessage(value);

  handleGoTo = to => () => (to ? this.props.history.push(to) : null);

  handleDeleteClick = () => this.setState({ confirmationModalOpen: true });

  handleConfirmRemove = () => this.props.removeProject({ projectId: this.props.project.id });

  handleCancelRemove = () => this.setState({ confirmationModalOpen: false });

  renderStatisticHeader = text => <CardHeader>{this.formatMessage(text)}</CardHeader>;

  renderStatistic = ({ header, value, to, id }, index) => (
    <CardWrapper key={index}>
      <Card id={id} headerComponent={header} onClick={this.handleGoTo(to)} customStyles={statisticsCardStyles}>
        <CardValue id={`${id}Value`}>{value}</CardValue>
      </Card>
    </CardWrapper>
  );

  renderDetail = ({ label, field, value, id, order }, index) => (
    <DetailItem order={order} key={index}>
      <DetailWrapper id={id}>
        <DetailLabel id={`${id}Label`}>{label}</DetailLabel>
        <DetailValue id={`${id}Value`}>{value || this.props.project[field] || ''}</DetailValue>
      </DetailWrapper>
      <IconEditWrapper id={`${id}EditButton`}>
        <Icons.EditIcon />
      </IconEditWrapper>
    </DetailItem>
  );

  renderProject = ({ id: projectId, editors, owner, slug, created, charts, pages, meta, status } = {}) => {
    const statistics = [
      {
        header: this.renderStatisticHeader(messages.dataSources),
        value: path(['dataSources', 'count'], meta),
        to: `/project/${projectId}/datasource`,
        id: 'projectDataSources',
      },
      { header: this.renderStatisticHeader(messages.charts), value: this.countItems(charts) },
      { header: this.renderStatisticHeader(messages.pages), value: this.countItems(pages) },
      {
        header: this.renderStatisticHeader(messages.users),
        value: this.countItems(editors),
        to: `/project/${projectId}/user`,
        id: 'projectUsers',
      },
    ].filter(({ value }) => !isNil(value));

    const { firstName = '', lastName = '' } = owner;

    const statusValue = messages[status] ? this.formatMessage(messages[status]) : status;
    const data = [
      {
        label: this.formatMessage(messages.lastUpdate),
        field: 'created',
        value: extendedDayjs(created, BASE_DATE_FORMAT).fromNow(),
        id: 'fieldLastUpdated',
        order: 1,
      },
      { label: this.formatMessage(messages.status), field: 'status', value: statusValue, id: 'fieldStatus', order: 3 },
      {
        label: this.formatMessage(messages.owner),
        field: 'owner',
        value: `${firstName} ${lastName}`,
        id: 'fieldOwner',
        order: 5,
      },
      { label: this.formatMessage(messages.titleField), field: 'title', id: 'fieldTitle', order: 2 },
      { label: this.formatMessage(messages.description), field: 'description', id: 'fieldDescription', order: 4 },
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
        <Statistics>{statistics.map(this.renderStatistic)}</Statistics>
        <Details>{data.map(this.renderDetail)}</Details>
      </ProjectView>
    );
  };

  renderContent = cond([[isEmpty, always(<Loader />)], [T, () => this.renderProject(this.props.project)]]);

  render() {
    const { project } = this.props;
    const { confirmationModalOpen } = this.state;
    const { projectId } = this.props.match.params;
    const projectName = path(['title'], project, '');
    const title = projectName ? projectName : this.formatMessage(messages.pageTitle);
    const topHeaderConfig = this.getHeaderAndMenuConfig(projectName, projectId, !projectId || has('error', project));

    return (
      <Container>
        <div>
          <Helmet title={title} />
          <TopHeader {...topHeaderConfig} />
          <ProjectTabs active={SETTINGS} url={`/project/${projectId}`} />
          {this.renderContent(project)}
          <LinkContainer>
            <Link id="deleteProjectDesktopBtn" onClick={this.handleDeleteClick}>
              <FormattedMessage {...messages.deleteProject} />
            </Link>
          </LinkContainer>
        </div>
        <NavigationContainer>
          <BackArrowButton id="addProjectBtn" onClick={this.handleGoTo('/project')} />
        </NavigationContainer>
        <Modal isOpen={confirmationModalOpen} contentLabel="Confirm Removal" style={getModalStyles()}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <ModalButton onClick={this.handleCancelRemove}>
              <FormattedMessage {...messages.cancelRemoval} />
            </ModalButton>
            <ModalButton onClick={this.handleConfirmRemove}>
              <FormattedMessage {...messages.confirmRemoval} />
            </ModalButton>
          </ModalActions>
        </Modal>
      </Container>
    );
  }
}
