import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Card, Icons, Typography } from 'schemaUI';
import { has, isEmpty, isNil, path, prop, either, both, always, cond, T, not } from 'ramda';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-modal';

import { generateApiUrl, isAdmin } from '../../../shared/utils/helpers';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { Loader } from '../../../shared/components/loader';
import { TopHeader } from '../../../shared/components/topHeader';
import { Empty } from '../project.styles';
import messages from './view.messages';
import {
  Container,
  CardWrapper,
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
} from './view.styles';
import { BackArrowButton, NavigationContainer } from '../../../shared/components/navigation';

import { modalStyles, ModalTitle, ModalButton, ModalActions } from '../../../shared/components/modal/modal.styles';

const { P } = Typography;

export class View extends PureComponent {
  static propTypes = {
    user: PropTypes.shape({
      role: PropTypes.string.isRequired,
    }),
    project: PropTypes.object.isRequired,
    isFetched: PropTypes.bool.isRequired,
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

  componentDidMount() {
    this.props.fetchProject(this.props.match.params);
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

      if (isAdmin(this.props.user)) {
        secondaryMenuItems.push(
          { label: this.formatMessage(messages.editProjectSettings), to: `/project/edit/${projectId}` },
          {
            label: this.formatMessage(messages.deleteProject),
            onClick: () => this.setState({ confirmationModalOpen: true }),
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

  handleConfirmRemove = () => this.props.removeProject({ projectId: this.props.project.id });

  handleCancelRemove = () => this.setState({ confirmationModalOpen: false });

  renderStatistic = ({ header, value, to }, index) => (
    <CardWrapper key={index}>
      <Card headerComponent={header} onClick={this.handleGoTo(to)} customStyles={statisticsCardStyles}>
        <CardValue>{value}</CardValue>
      </Card>
    </CardWrapper>
  );

  renderDetail = ({ label, field, value }, index) => (
    <DetailItem key={index}>
      <DetailWrapper>
        <DetailLabel>{label}</DetailLabel>
        <DetailValue>{value || this.props.project[field] || ''}</DetailValue>
      </DetailWrapper>
      <IconEditWrapper>
        <Icons.EditIcon />
      </IconEditWrapper>
    </DetailItem>
  );

  renderProject = ({ id: projectId, editors, owner, slug, created, charts, pages, meta, status } = {}) => {
    const statistics = [
      {
        header: this.formatMessage(messages.dataSources),
        value: path(['dataSources', 'count'], meta),
        to: `/project/${projectId}/datasource`,
      },
      { header: this.formatMessage(messages.charts), value: this.countItems(charts) },
      { header: this.formatMessage(messages.pages), value: this.countItems(pages) },
      {
        header: this.formatMessage(messages.users),
        value: this.countItems(editors),
        to: `/project/${projectId}/user`,
      },
    ].filter(({ value }) => !isNil(value));

    const { firstName = '', lastName = '' } = owner;

    const statusValue = messages[status] ? this.formatMessage(messages[status]) : status;
    const data = [
      {
        label: this.formatMessage(messages.lastUpdate),
        field: 'created',
        value: extendedDayjs(created, BASE_DATE_FORMAT).fromNow(),
      },
      { label: this.formatMessage(messages.status), field: 'status', value: statusValue },
      { label: this.formatMessage(messages.owner), field: 'owner', value: `${firstName} ${lastName}` },
      { label: this.formatMessage(messages.titleField), field: 'title' },
      { label: this.formatMessage(messages.description), field: 'description' },
      { label: this.formatMessage(messages.api), field: 'slug', value: generateApiUrl(slug) },
    ];

    return (
      <ProjectView>
        <Statistics>{statistics.map(this.renderStatistic)}</Statistics>
        <Details>{data.map(this.renderDetail)}</Details>
      </ProjectView>
    );
  };

  renderNoData = () => (
    <Empty>
      <P>{this.formatMessage(messages.noProject)}</P>
    </Empty>
  );

  renderContent = cond([
    [() => not(this.props.isFetched), always(<Loader />)],
    [either(isEmpty, has('error')), this.renderNoData],
    [T, () => this.renderProject(this.props.project)],
  ]);

  render() {
    const { project } = this.props;
    const { confirmationModalOpen } = this.state;
    const { projectId } = this.props.match.params;
    const projectName = path(['title'], project, '');
    const title = projectName ? projectName : this.formatMessage(messages.pageTitle);
    const topHeaderConfig = this.getHeaderAndMenuConfig(projectName, projectId, !project || has('error', project));

    return (
      <Container>
        <div>
          <Helmet title={title} />
          <TopHeader {...topHeaderConfig} />
          {this.renderContent(project)}
        </div>
        <NavigationContainer>
          <BackArrowButton id="addProjectBtn" onClick={this.handleGoTo('/project')} />
        </NavigationContainer>
        <Modal isOpen={confirmationModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
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
