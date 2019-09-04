import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Button, Card, Icons, Typography } from 'schemaUI';
import { has, isEmpty, isNil, path } from 'ramda';

import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import { generateApiUrl } from '../../../shared/utils/helpers';
import extendedDayjs from '../../../shared/utils/extendedDayjs';
import { Loader } from '../../../shared/components/loader';
import { TopHeader } from '../../../shared/components/topHeader';
import { Empty } from '../project.styles';
import messages from './view.messages';
import { Empty } from '../project.styles';
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
  buttonStyles,
} from './view.styles';

const { P } = Typography;

export class View extends PureComponent {
  static propTypes = {
    project: PropTypes.object.isRequired,
    fetchProject: PropTypes.func.isRequired,
    unmountProject: PropTypes.func.isRequired,
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

  componentDidMount() {
    this.props.fetchProject(this.props.match.params.projectId);
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
        to: `/project/view/${projectId}/datasource`,
      });
      secondaryMenuItems.push(
        { label: this.formatMessage(messages.editProjectSettings), to: `/project/edit/${projectId}` },
        { label: this.formatMessage(messages.deleteProject), to: `/project/delete/${projectId}` }
      );
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

  handleGoToProjectsList = () => this.props.history.push('/project/list');

  renderStatistic = ({ header, value }, index) => (
    <CardWrapper key={index}>
      <Card headerComponent={header}>
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

  renderProject = (_, { editors, dataSources = [], owner, slug, created, charts, pages } = {}) => {
    const statistics = [
      { header: this.formatMessage(messages.dataSources), value: this.countItems(dataSources) },
      { header: this.formatMessage(messages.charts), value: this.countItems(charts) },
      { header: this.formatMessage(messages.pages), value: this.countItems(pages) },
      { header: this.formatMessage(messages.users), value: this.countItems(editors) },
    ].filter(({ value }) => !isNil(value));

    const { firstName = '', lastName = '' } = owner;

    const data = [
      { label: this.formatMessage(messages.lastUpdate), field: 'created', value: extendedDayjs(created).fromNow() },
      { label: this.formatMessage(messages.status), field: 'status' },
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

  render() {
    const { project } = this.props;
    const { projectId } = this.props.match.params;
    const projectName = path(['title'], project, '');
    const title = projectName ? projectName : this.formatMessage(messages.pageTitle);
    const hasNoData = !project || has('error', project);
    const topHeaderConfig = this.getHeaderAndMenuConfig(projectName, projectId, hasNoData);

    const content = isEmpty(project) ? (
      <Loader />
    ) : (
      renderWhenTrueOtherwise(this.renderNoData, this.renderProject)(hasNoData, project)
    );

    return (
      <Container>
        <Helmet title={title} />
        <TopHeader {...topHeaderConfig} />
        {content}
        <Button onClick={this.handleGoToProjectsList} customStyles={buttonStyles}>
          <Icons.ArrowLeftIcon />
        </Button>
      </Container>
    );
  }
}
