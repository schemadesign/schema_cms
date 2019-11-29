import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Icons } from 'schemaUI';
import { always, cond, propIs, T } from 'ramda';

import { TopHeader } from '../../../shared/components/topHeader';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ListItem, ListContainer } from '../../../shared/components/listComponents';
import { BackArrowButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { SOURCES } from '../../../shared/components/projectTabs/projectTabs.constants';
import {
  Container,
  Header,
  HeaderIcon,
  iconSourceStyles,
  MetaData,
  MetaDataName,
  MetaDataValue,
  MetaDataWrapper,
} from './dataSourceList.styles';
import messages from './dataSourceList.messages';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { HeaderItem, HeaderList } from '../list/list.styles';
import {
  DATA_WRANGLING_RESULT_STEP,
  FIELDS_STEP,
  INITIAL_STEP,
} from '../../../modules/dataSource/dataSource.constants';
import { ListItemTitle } from '../../../shared/components/listComponents/listItem.styles';

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

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const projectId = this.props.match.params.projectId;

      await this.props.fetchDataSources({ projectId });
      this.setState({ loading: false });
    } catch (error) {
      this.setState({
        loading: false,
        error,
      });
    }
  }

  componentWillUnmount() {
    this.props.cancelFetchListLoop();
  }

  getHeaderAndMenuConfig = (headerTitle, headerSubtitle) => ({
    headerTitle,
    headerSubtitle,
    secondaryMenuItems: [
      {
        label: this.props.intl.formatMessage(messages.projectDetails),
        to: `/project/${this.props.match.params.projectId}`,
      },
    ],
  });

  getStep = cond([
    [propIs(Object, 'activeJob'), always(DATA_WRANGLING_RESULT_STEP)],
    [propIs(Object, 'metaData'), always(FIELDS_STEP)],
    [T, always(INITIAL_STEP)],
  ]);

  getLoadingConfig = (loading, error, dataSources) => ({
    loading,
    error,
    noData: !dataSources.length,
    noDataContent: this.props.intl.formatMessage(messages.noData),
  });

  handleShowProject = () => this.props.history.push(`/project/${this.props.match.params.projectId}`);

  handleCreateDataSource = () =>
    this.props.history.push(`/project/${this.props.match.params.projectId}/datasource/add`);

  handleShowDataSource = ({ id, metaData, activeJob }) => {
    const step = this.getStep({ metaData, activeJob });

    this.props.history.push(`/datasource/${id}/${step}`);
  };

  renderCreatedInformation = list => (
    <Header>
      <HeaderList>
        {list.map((item, index) => (
          <HeaderItem id={`headerItem-${index}`} key={index}>
            {item}
          </HeaderItem>
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
        <MetaDataName id={`metaItem-${index}`}>{name}</MetaDataName>
        <MetaDataValue id={`metaItemValue-${index}`}>{value || DEFAULT_VALUE}</MetaDataValue>
      </MetaData>
    ));

    return <MetaDataWrapper>{elements}</MetaDataWrapper>;
  };

  renderItem = ({ name, created, createdBy: { firstName, lastName }, id, metaData, activeJob }, index) => {
    const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
    const header = this.renderCreatedInformation([whenCreated, `${firstName} ${lastName}`]);
    const footer = this.renderMetaData(metaData || {});

    return (
      <ListItem key={index} headerComponent={header} footerComponent={footer}>
        <ListItemTitle id="dataSourceTitle" onClick={() => this.handleShowDataSource({ id, metaData, activeJob })}>
          {name}
        </ListItemTitle>
      </ListItem>
    );
  };

  render() {
    const { loading, error } = this.state;
    const { dataSources = [], match } = this.props;
    const title = this.props.intl.formatMessage(messages.title);
    const subtitle = this.props.intl.formatMessage(messages.subTitle);
    const topHeaderConfig = this.getHeaderAndMenuConfig(title, subtitle);
    const loadingConfig = this.getLoadingConfig(loading, error, dataSources);

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <TopHeader {...topHeaderConfig} />
        <ProjectTabs active={SOURCES} url={`/project/${match.params.projectId}`} />
        <ContextHeader title={title} subtitle={subtitle}>
          <PlusButton id="createDataSourceDesktopBtn" onClick={this.handleCreateDataSource} />
        </ContextHeader>
        <LoadingWrapper {...loadingConfig}>
          <ListContainer>{dataSources.map(this.renderItem)}</ListContainer>
        </LoadingWrapper>
        <NavigationContainer hideOnDesktop>
          <BackArrowButton id="backBtn" onClick={this.handleShowProject} />
          <PlusButton id="createDataSourceBtn" onClick={this.handleCreateDataSource} />
        </NavigationContainer>
      </Container>
    );
  }
}
