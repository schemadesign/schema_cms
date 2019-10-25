import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Card, Icons, Typography } from 'schemaUI';
import { always, cond, propEq, propIs, T } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { TopHeader } from '../../../shared/components/topHeader';
import {
  Container,
  DataSourceItem,
  DataSourceListWrapper,
  Header,
  HeaderIcon,
  iconSourceStyles,
  Job,
  JobDate,
  JobDetails,
  JobName,
  JobsContainer,
  JobStatus,
  JobsTitle,
  MetaData,
  MetaDataName,
  MetaDataValue,
  MetaDataWrapper,
  titleStyles,
} from './dataSourceList.styles';
import messages from './dataSourceList.messages';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { HeaderItem, HeaderList } from '../list/list.styles';
import {
  DATA_WRANGLING_RESULT_STEP,
  FIELDS_STEP,
  INITIAL_STEP,
} from '../../../modules/dataSource/dataSource.constants';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { BackArrowButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';

const { H1 } = Typography;
const { CsvIcon, IntersectIcon } = Icons;
const DEFAULT_VALUE = '—';

export class DataSourceList extends PureComponent {
  static propTypes = {
    createDataSource: PropTypes.func.isRequired,
    fetchDataSources: PropTypes.func.isRequired,
    cancelFetchListLoop: PropTypes.func.isRequired,
    dataSources: PropTypes.array.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const projectId = this.props.match.params.projectId;

    this.props.fetchDataSources({ projectId });
  }

  componentWillUnmount() {
    this.props.cancelFetchListLoop();
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: this.props.intl.formatMessage(messages.title),
    headerSubtitle: this.props.intl.formatMessage(messages.subTitle),
    secondaryMenuItems: [
      {
        label: this.props.intl.formatMessage(messages.projectDetails),
        to: `/project/${this.props.match.params.projectId}`,
      },
    ],
  });

  getStep = cond([
    [propEq('isJobSuccess', true), always(DATA_WRANGLING_RESULT_STEP)],
    [propIs(Object, 'metaData'), always(FIELDS_STEP)],
    [T, always(INITIAL_STEP)],
  ]);

  handleShowProject = () => this.props.history.push(`/project/${this.props.match.params.projectId}`);

  handleCreateDataSource = () => {
    const projectId = this.props.match.params.projectId;

    this.props.createDataSource({ projectId });
  };

  handleShowDataSource = ({ id, metaData, jobs = [] }) => {
    const isJobSuccess = jobs.some(({ jobState }) => jobState === 'success');
    const step = this.getStep({ metaData, isJobSuccess });

    this.props.history.push(`/datasource/${id}/${step}`);
  };

  renderCreatedInformation = list => (
    <Header>
      <HeaderList>
        {list.map((item, index) => (
          <HeaderItem key={index}>{item}</HeaderItem>
        ))}
      </HeaderList>
      <HeaderIcon>
        <IntersectIcon />
      </HeaderIcon>
    </Header>
  );

  renderMetaData = ({ items, fields, filters, views }) => {
    const { formatMessage } = this.props.intl;
    const list = [
      { name: formatMessage(messages.source), value: <CsvIcon customStyles={iconSourceStyles} /> },
      { name: formatMessage(messages.items), value: items },
      { name: formatMessage(messages.fields), value: fields },
      { name: formatMessage(messages.filters), value: filters },
      { name: formatMessage(messages.views), value: views },
    ];

    const elements = list.map(({ name, value }, index) => (
      <MetaData key={index}>
        <MetaDataName>{name}</MetaDataName>
        <MetaDataValue>{value || DEFAULT_VALUE}</MetaDataValue>
      </MetaData>
    ));

    return <MetaDataWrapper>{elements}</MetaDataWrapper>;
  };

  renderJob = ({ jobState, id, modified }, index) => {
    const modifiedDate = extendedDayjs(modified, BASE_DATE_FORMAT).format('DD/MM/YYYY HH:mm');

    return (
      <Job key={index}>
        <JobDetails>
          <JobStatus status={jobState}>{jobState}</JobStatus>
          <JobName>
            <FormattedMessage {...messages.jobId} /> {id}
          </JobName>
        </JobDetails>
        <JobDate>
          <FormattedMessage {...messages.updatedAt} /> {modifiedDate}
        </JobDate>
      </Job>
    );
  };

  renderJobs = jobs =>
    renderWhenTrue(() => (
      <JobsContainer>
        <JobsTitle>
          <FormattedMessage {...messages.jobTitle} />
        </JobsTitle>
        {jobs.map(this.renderJob)}
      </JobsContainer>
    ));

  renderItem = ({ name, created, createdBy: { firstName, lastName }, id, metaData, jobs }, index) => {
    const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
    const header = this.renderCreatedInformation([whenCreated, `${firstName} ${lastName}`]);

    return (
      <DataSourceItem key={index}>
        <Card headerComponent={header}>
          <H1 customStyles={titleStyles} onClick={() => this.handleShowDataSource({ id, metaData, jobs })}>
            {name}
          </H1>
          {this.renderMetaData(metaData || {})}
          {this.renderJobs(jobs)(!!jobs.length)}
        </Card>
      </DataSourceItem>
    );
  };

  render() {
    const { dataSources = [] } = this.props;
    const topHeaderConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <TopHeader {...topHeaderConfig} />
        <DataSourceListWrapper>{dataSources.map(this.renderItem)}</DataSourceListWrapper>

        <NavigationContainer>
          <BackArrowButton onClick={this.handleShowProject} />
          <PlusButton onClick={this.handleCreateDataSource} />
        </NavigationContainer>
      </Container>
    );
  }
}
