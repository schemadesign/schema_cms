import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Card } from 'schemaUI';
import { always, isEmpty, isNil, path } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { renderWhenTrue } from '../../../shared/utils/rendering';
import { generateApiUrl } from '../../../shared/utils/helpers';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
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
  Statistics,
  statisticsCardStyles,
} from './view.styles';
import { BackArrowButton, BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';

import { modalStyles, Modal, ModalTitle, ModalActions } from '../../../shared/components/modal/modal.styles';
import { Link, LinkContainer } from '../../../theme/typography';

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
    loading: true,
    error: null,
    confirmationModalOpen: false,
  };

  async componentDidMount() {
    try {
      await this.props.fetchProject(this.props.match.params);
      this.setState({ loading: false });
    } catch (error) {
      this.setState({
        loading: false,
        error,
      });
    }
  }

  componentWillUnmount() {
    return this.props.unmountProject();
  }

  getHeaderAndMenuConfig = (headerSubtitle, projectId, hasMenu) => {
    const primaryMenuItems = [];
    const secondaryMenuItems = [];

    if (hasMenu) {
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
    </DetailItem>
  );

  renderProject = ({ id: projectId, editors, owner = {}, slug, created, charts, meta, status } = {}) => {
    const getCount = propName => path([propName, 'count'], meta);
    const statistics = [
      {
        header: this.renderStatisticHeader(messages.dataSources),
        value: getCount('dataSources'),
        to: `/project/${projectId}/datasource`,
        id: 'projectDataSources',
      },
      { header: this.renderStatisticHeader(messages.charts), value: this.countItems(charts) },
      {
        header: this.renderStatisticHeader(messages.pages),
        value: getCount('pages'),
        to: `/project/${projectId}/directory`,
        id: 'projectDirectories',
      },
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

  renderRemoveProjectButton = renderWhenTrue(
    always(
      <LinkContainer>
        <Link id="deleteProjectDesktopBtn" onClick={this.handleDeleteClick}>
          <FormattedMessage {...messages.deleteProject} />
        </Link>
      </LinkContainer>
    )
  );

  renderContent = (project, projectId, isAdmin) =>
    renderWhenTrue(() => (
      <Fragment>
        <ProjectTabs active={SETTINGS} url={`/project/${projectId}`} />
        {this.renderProject(project)}
        {this.renderRemoveProjectButton(isAdmin)}
      </Fragment>
    ))(!isEmpty(project));

  render() {
    const { project, isAdmin } = this.props;
    const { confirmationModalOpen, error, loading } = this.state;
    const { projectId } = this.props.match.params;
    const projectName = path(['title'], project, '');
    const title = projectName ? projectName : this.formatMessage(messages.pageTitle);
    const topHeaderConfig = this.getHeaderAndMenuConfig(projectName, projectId, !loading);

    return (
      <Container>
        <div>
          <Helmet title={title} />
          <TopHeader {...topHeaderConfig} />
          <LoadingWrapper loading={loading} noData={isEmpty(project)} error={error}>
            {this.renderContent(project, projectId, isAdmin)}
          </LoadingWrapper>
        </div>
        <NavigationContainer>
          <BackArrowButton id="backProjectBtn" onClick={this.handleGoTo('/project')} />
        </NavigationContainer>
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
      </Container>
    );
  }
}
