import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Header, Icons, Typography } from 'schemaUI';
import { isEmpty, isNil, path } from 'ramda';

import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import { generateApiUrl } from '../../../shared/utils/helpers';
import extendedDayjs from '../../../shared/utils/extendedDayjs';
import { Empty, Loader, headerStyles } from '../project.styles';
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
  IconEdit,
  Statistics,
  buttonStyles,
} from './view.styles';

const { H1, H2, P } = Typography;

export class View extends PureComponent {
  static propTypes = {
    project: PropTypes.object.isRequired,
    fetchProject: PropTypes.func.isRequired,
    unsetFetchedProject: PropTypes.func.isRequired,
    isFetchedProject: PropTypes.bool.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    this.props.fetchProject(this.props.match.params.id);
  }

  componentWillUnmount() {
    return this.props.unsetFetchedProject();
  }

  countItems = value => (isNil(value) ? null : value.length);

  handleGoToProjectsList = () => this.props.history.push('/projects');

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
      <IconEdit />
    </DetailItem>
  );

  renderProject = (_, { editors, dataSources = [], owner, slug, created, charts, pages } = {}) => {
    const statistics = [
      { header: 'Data Sources', value: this.countItems(dataSources) },
      { header: 'Charts', value: this.countItems(charts) },
      { header: 'Pages', value: this.countItems(pages) },
      { header: 'Users', value: this.countItems(editors) },
    ].filter(({ value }) => !isNil(value));

    const { firstName = '', lastName = '' } = owner;

    const data = [
      { label: 'Last Update', field: 'created', value: extendedDayjs(created).fromNow() },
      { label: 'Status', field: 'status' },
      { label: 'Owner', field: 'owner', value: `${firstName} ${lastName}` },
      { label: 'Title', field: 'title' },
      { label: 'Description', field: 'description' },
      { label: 'API', field: 'slug', value: generateApiUrl(slug) },
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
      <P>Project doesn't exist.</P>
    </Empty>
  );

  render() {
    const { project, isFetchedProject } = this.props;
    const title = path(['title'], project, '');

    const content = isFetchedProject ? (
      renderWhenTrueOtherwise(this.renderNoData, this.renderProject)(isEmpty(project), project)
    ) : (
      <Loader />
    );

    return (
      <Container>
        <Header customStyles={headerStyles}>
          <H2>Project</H2>
          <H1>{title}</H1>
        </Header>
        {content}
        <Button onClick={this.handleGoToProjectsList} customStyles={buttonStyles}>
          <Icons.ArrowLeftIcon />
        </Button>
      </Container>
    );
  }
}
