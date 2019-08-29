import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Typography, Card } from 'schemaUI';
import { isEmpty, path } from 'ramda';
import { Link } from 'react-router-dom';

import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import { generateApiUrl } from '../../../shared/utils/helpers';
import extendedDayjs from '../../../shared/utils/extendedDayjs';
import {
  Container,
  Empty,
  CardValue,
  ProjectView,
  Details,
  DetailItem,
  DetailLabel,
  DetailValue,
  Statistics,
  statisticCardStyles,
  headerStyles,
} from './view.styles';

const { H1, H2, P } = Typography;

export class View extends PureComponent {
  static propTypes = {
    project: PropTypes.object.isRequired,
    fetchProject: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    const a = this.props.fetchProject(this.props.match.params.id);

    console.log('> fetch', a);
  }

  componentDidUpdate() {
    console.log('> update');
    if (this.state.isLoading) {
      this.setState({
        isLoading: false,
      });
    }
  }

  renderStatistic = ({ header, value }, index) => (
    <Card header={header} customStyles={statisticCardStyles} key={index}>
      <CardValue>{value}</CardValue>
    </Card>
  );

  renderDetail = ({ label, field, value }, index) => (
    <DetailItem key={index}>
      <DetailLabel>{label}</DetailLabel>
      <DetailValue>{value || this.props.project[field] || ''}</DetailValue>
    </DetailItem>
  );

  renderProject = (_, { editors = [], dataSources = [], owner, slug, created } = {}) => {
    const statistics = [
      { header: 'Data Sources', value: dataSources.length },
      { header: 'Users', value: editors.length },
    ];

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
    const { project } = this.props;
    const title = path(['title'], project, '');

    const content = this.state.isLoading
      ? 'Loading...'
      : renderWhenTrueOtherwise(this.renderNoData, this.renderProject)(isEmpty(project), project);

    return (
      <Container>
        <Header customStyles={headerStyles}>
          <H2>Project</H2>
          <H1>{title}</H1>
        </Header>
        {content}
        <Link to="/projects">Projects</Link>
      </Container>
    );
  }
}
