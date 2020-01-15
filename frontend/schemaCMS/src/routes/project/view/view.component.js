import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Card } from 'schemaUI';
import { always, isEmpty, isNil, path } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { renderWhenTrue } from '../../../shared/utils/rendering';
import { generateApiUrl, getMatchParam } from '../../../shared/utils/helpers';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { SETTINGS } from '../../../shared/components/projectTabs/projectTabs.constants';
import messages from './view.messages';
import {
  CardHeader,
  CardValue,
  CardWrapper,
  Container,
  DetailItem,
  DetailLabel,
  Details,
  DetailValue,
  DetailWrapper,
  ProjectView,
  Statistics,
  statisticsCardStyles,
} from './view.styles';
import { BackArrowButton, BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';

import { Modal, ModalActions, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
import { Link, LinkContainer } from '../../../theme/typography';
import { getMenuProjects, PROJECT_DETAILS_ID } from '../project.constants';

export class View extends PureComponent {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
    fetchProject: PropTypes.func.isRequired,
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

  renderProject = ({ id: projectId, owner = {}, slug, created, meta, status } = {}) => {
    const statistics = [
      {
        header: this.renderStatisticHeader(messages.dataSources),
        value: meta.dataSources,
        to: `/project/${projectId}/datasource`,
        id: 'projectDataSources',
      },
      { header: this.renderStatisticHeader(messages.charts), value: meta.charts },
      {
        header: this.renderStatisticHeader(messages.pages),
        value: meta.pages,
        to: `/project/${projectId}/folder`,
        id: 'projectUsers',
      },
      {
        header: this.renderStatisticHeader(messages.users),
        value: meta.users,
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
      {
        label: this.formatMessage(messages.status),
        field: 'status',
        value: statusValue,
        id: 'fieldStatus',
        order: 3,
      },
      {
        label: this.formatMessage(messages.owner),
        field: 'owner',
        value: `${firstName} ${lastName}`,
        id: 'fieldOwner',
        order: 5,
      },
      { label: this.formatMessage(messages.titleField), field: 'title', id: 'fieldTitle', order: 2 },
      {
        label: this.formatMessage(messages.description),
        field: 'description',
        id: 'fieldDescription',
        order: 4,
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

  renderContent = () => (
    <Fragment>
      {this.renderProject(this.props.project)}
      {this.renderRemoveProjectButton(this.props.isAdmin)}
    </Fragment>
  );

  render() {
    const { project, isAdmin } = this.props;
    const { confirmationModalOpen, error, loading } = this.state;
    const projectId = getMatchParam(this.props, 'projectId');
    const headerSubtitle = path(['title'], project, <FormattedMessage {...messages.subTitle} />);
    const headerTitle = <FormattedMessage {...messages.title} />;

    return (
      <Container>
        <div>
          <Helmet title={this.formatMessage(messages.pageTitle)} />
          <MobileMenu
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
            options={getMenuProjects(projectId, PROJECT_DETAILS_ID)}
            isEditor={!isAdmin}
          />
          <ProjectTabs active={SETTINGS} url={`/project/${projectId}`} />
          <LoadingWrapper loading={loading} noData={isEmpty(project)} error={error}>
            {this.renderContent}
          </LoadingWrapper>
        </div>
        <NavigationContainer fixed>
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
