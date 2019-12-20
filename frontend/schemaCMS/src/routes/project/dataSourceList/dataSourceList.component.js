import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Icons } from 'schemaUI';
import { always, cond, equals, T, propEq, either } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { TopHeader } from '../../../shared/components/topHeader';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ListItem, ListContainer, ListItemTitle } from '../../../shared/components/listComponents';
import { BackArrowButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { SOURCES } from '../../../shared/components/projectTabs/projectTabs.constants';
import {
  Container,
  getSourceIconStyles,
  Header,
  HeaderIcon,
  Loading,
  MetaData,
  MetaDataName,
  MetaDataValue,
  MetaDataWrapper,
} from './dataSourceList.styles';
import messages from './dataSourceList.messages';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { HeaderItem, HeaderList } from '../list/list.styles';
import {
  META_FAILED,
  META_PENDING,
  META_PROCESSING,
  PREVIEW_PAGE,
  RESULT_PAGE,
  SOURCE_PAGE,
} from '../../../modules/dataSource/dataSource.constants';
import { getMatchParam } from '../../../shared/utils/helpers';
import { formatPrefixedNumber } from '../../../shared/utils/numberFormating';

const { CsvIcon, IntersectIcon } = Icons;
const DEFAULT_VALUE = '—';

export class DataSourceList extends PureComponent {
  static propTypes = {
    createDataSource: PropTypes.func.isRequired,
    fetchDataSources: PropTypes.func.isRequired,
    cancelFetchListLoop: PropTypes.func.isRequired,
    dataSources: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired,
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
      const projectId = getMatchParam(this.props, 'projectId');

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

  getLoadingConfig = (loading, error, dataSources) => ({
    loading,
    error,
    noData: !dataSources.length,
    noDataContent: this.props.intl.formatMessage(messages.noData),
  });

  getDataSourcePage = cond([
    [equals(null), always(SOURCE_PAGE)],
    [propEq('scripts', []), always(PREVIEW_PAGE)],
    [T, always(RESULT_PAGE)],
  ]);

  handleShowProject = () => this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}`);

  handleCreateDataSource = () =>
    this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}/datasource/add`);

  handleShowDataSource = ({ id, activeJob }) => {
    const dataSourcePage = this.getDataSourcePage(activeJob);

    this.props.history.push(`/datasource/${id}/${dataSourcePage}`);
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

  renderMetaData = ({ items, fields, filters, views }, loading) => {
    const {
      intl: { formatMessage },
      theme,
    } = this.props;

    const list = [
      { name: formatMessage(messages.source), value: <CsvIcon customStyles={getSourceIconStyles(theme, loading)} /> },
      { name: formatMessage(messages.items), value: formatPrefixedNumber(items) },
      { name: formatMessage(messages.fields), value: fields },
      { name: formatMessage(messages.filters), value: filters },
      { name: formatMessage(messages.views), value: views },
    ];

    const elements = list.map(({ name, value }, index) => (
      <MetaData key={index} loading={loading}>
        <MetaDataName id={`metaItem-${index}`}>{name}</MetaDataName>
        <MetaDataValue id={`metaItemValue-${index}`}>{value || DEFAULT_VALUE}</MetaDataValue>
      </MetaData>
    ));

    return <MetaDataWrapper>{elements}</MetaDataWrapper>;
  };

  renderLoading = message => (
    <Loading loading>
      {message}
    </Loading>
  );

  renderHeader = ({ whenCreated, firstName, lastName, jobProcessing, metaData }) =>
    cond([
      [
        either(propEq('metaStatus', META_PENDING), propEq('metaStatus', META_PROCESSING)),
        always(this.renderLoading(<FormattedMessage {...messages.metaProcessing} />)),
      ],
      [propEq('jobProcessing', true), always(this.renderLoading(<FormattedMessage {...messages.jobProcessing} />))],
      [propEq('metaStatus', META_FAILED), always(this.renderLoading(<FormattedMessage {...messages.metaFailed} />))],
      [T, always(this.renderCreatedInformation([whenCreated, `${firstName} ${lastName}`]))],
    ])({ metaStatus: metaData.status, jobProcessing });

  renderItem = (
    { name, created, createdBy: { firstName, lastName }, id, metaData, activeJob, jobsInProcess },
    index
  ) => {
    const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
    const jobProcessing = !activeJob || jobsInProcess;
    const header = this.renderHeader({ whenCreated, firstName, lastName, jobProcessing, metaData });
    const footer = this.renderMetaData(metaData || {}, loading);

    return (
      <ListItem key={index} headerComponent={header} footerComponent={footer}>
        <ListItemTitle id="dataSourceTitle" onClick={() => this.handleShowDataSource({ id, activeJob })}>
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
    const loadingConfig = this.getLoadingConfig(loading, error, dataSources);

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <TopHeader headerSubtitle={subtitle} headerTitle={title} projectId={getMatchParam(this.props, 'projectId')} />
        <ProjectTabs active={SOURCES} url={`/project/${match.params.projectId}`} />
        <ContextHeader title={title} subtitle={subtitle}>
          <PlusButton id="createDataSourceDesktopBtn" onClick={this.handleCreateDataSource} />
        </ContextHeader>
        <LoadingWrapper {...loadingConfig}>
          <ListContainer>{dataSources.map(this.renderItem)}</ListContainer>
        </LoadingWrapper>
        <NavigationContainer fixed hideOnDesktop>
          <BackArrowButton id="backBtn" onClick={this.handleShowProject} />
          <PlusButton id="createDataSourceBtn" onClick={this.handleCreateDataSource} />
        </NavigationContainer>
      </Container>
    );
  }
}
