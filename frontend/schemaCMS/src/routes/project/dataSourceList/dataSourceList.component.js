import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Icons } from 'schemaUI';
import { always, cond, equals, propEq, T, find } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { ProjectTabs } from '../../../shared/components/projectTabs';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ListContainer, ListItem, ListItemTitle } from '../../../shared/components/listComponents';
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
import { META_FAILED, PREVIEW_PAGE, RESULT_PAGE, SOURCE_PAGE } from '../../../modules/dataSource/dataSource.constants';
import { filterMenuOptions, getMatchParam, isProcessingData } from '../../../shared/utils/helpers';
import { formatPrefixedNumber } from '../../../shared/utils/numberFormating';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions, PROJECT_DATASOURCE_ID } from '../project.constants';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { JOB_STATE_FAILURE } from '../../../modules/job/job.constants';

const { CsvIcon, IntersectIcon } = Icons;
const DEFAULT_VALUE = '—';

export class DataSourceList extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string,
    createDataSource: PropTypes.func.isRequired,
    fetchDataSources: PropTypes.func.isRequired,
    cancelFetchListLoop: PropTypes.func.isRequired,
    dataSources: PropTypes.array.isRequired,
    uploadingDataSources: PropTypes.array.isRequired,
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
      reportError(error);
      this.setState({ loading: false, error });
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

  renderMetaData = ({ metaData: { items, fields, filters, tags }, metaProcessing }) => {
    const {
      intl: { formatMessage },
      theme,
    } = this.props;

    const list = [
      {
        name: formatMessage(messages.source),
        value: <CsvIcon customStyles={getSourceIconStyles(theme, metaProcessing)} />,
      },
      { name: formatMessage(messages.items), value: formatPrefixedNumber(items) },
      { name: formatMessage(messages.fields), value: fields },
      { name: formatMessage(messages.filters), value: filters },
      { name: formatMessage(messages.tags), value: tags },
    ];
    const elements = list.map(({ name, value }, index) => (
      <MetaData key={index} metaProcessing={metaProcessing}>
        <MetaDataName id={`metaItem-${index}`}>{name}</MetaDataName>
        <MetaDataValue id={`metaItemValue-${index}`}>{value || DEFAULT_VALUE}</MetaDataValue>
      </MetaData>
    ));

    return <MetaDataWrapper>{elements}</MetaDataWrapper>;
  };

  renderLoading = message => (
    <Loading id="dataSourceStatus" metaProcessing>
      {message}
    </Loading>
  );

  renderHeader = ({
    whenCreated,
    firstName,
    lastName,
    jobProcessing,
    jobFailed,
    metaProcessing,
    metaFailed,
    isUploading,
    uploadProgress,
    fileUploadingError,
  }) =>
    cond([
      [
        propEq('isUploading', true),
        always(this.renderLoading(<FormattedMessage id="fileUploadingStatus" {...messages.fileUploading} values={{ uploadProgress }} />)),
      ],
      [
        propEq('fileUploadingError', true),
        always(this.renderLoading(<FormattedMessage id="fileUploadingErrorStatus" {...messages.fileUploadingError} />)),
      ],
      [
        propEq('metaProcessing', true),
        always(this.renderLoading(<FormattedMessage id="metaProcessingStatus" {...messages.metaProcessing} />)),
      ],
      [
        propEq('metaFailed', true),
        always(this.renderLoading(<FormattedMessage id="metaProcessingErrorStatus" {...messages.metaFailed} />)),
      ],
      [
        propEq('jobProcessing', true),
        always(this.renderLoading(<FormattedMessage id="dataWranglingStatus" {...messages.jobProcessing} />)),
      ],
      [propEq('jobFailed', true), always(this.renderLoading(<FormattedMessage id="dataWranglingErrorStatus" {...messages.jobFailed} />))],
      [T, always(this.renderCreatedInformation([whenCreated, `${firstName} ${lastName}`]))],
    ])({ metaFailed, jobProcessing, metaProcessing, isUploading, fileUploadingError, jobFailed });

  renderItem = ({ name, created, createdBy, id, metaData, activeJob, jobsState = {}, fileName }, index) => {
    const { firstName = '—', lastName = '' } = createdBy || {};
    const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
    const jobFailed = propEq('lastJobStatus', JOB_STATE_FAILURE)(jobsState);
    const metaFailed = propEq('status', META_FAILED)(metaData);
    const { metaProcessing, jobProcessing } = isProcessingData({ jobsState, metaData });
    const fileUploadingError = !fileName;
    const fileUploading = find(propEq('id', id), this.props.uploadingDataSources);
    const isUploading = !!fileUploading;
    const uploadProgress = fileUploading && fileUploading.progress;

    const header = this.renderHeader({
      whenCreated,
      uploadProgress,
      firstName,
      lastName,
      jobProcessing,
      jobFailed,
      metaProcessing,
      metaFailed,
      isUploading,
      fileUploadingError,
    });
    const footer = this.renderMetaData({ metaData, metaProcessing });

    return (
      <ListItem id="dataSourceContainer" key={index} headerComponent={header} footerComponent={footer}>
        <ListItemTitle id="dataSourceTitle" onClick={() => this.handleShowDataSource({ id, activeJob })}>
          {name}
        </ListItemTitle>
      </ListItem>
    );
  };

  renderList = renderWhenTrue(() => <ListContainer>{this.props.dataSources.map(this.renderItem)}</ListContainer>);

  render() {
    const { loading, error } = this.state;
    const { dataSources = [], match, userRole } = this.props;
    const title = this.props.intl.formatMessage(messages.title);
    const subtitle = this.props.intl.formatMessage(messages.subTitle);
    const loadingConfig = this.getLoadingConfig(loading, error, dataSources);
    const projectId = getMatchParam(this.props, 'projectId');
    const menuOptions = getProjectMenuOptions(projectId);

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <MobileMenu
          headerTitle={title}
          headerSubtitle={subtitle}
          options={filterMenuOptions(menuOptions, userRole)}
          active={PROJECT_DATASOURCE_ID}
        />
        <ProjectTabs active={SOURCES} url={`/project/${match.params.projectId}`} />
        <ContextHeader title={title} subtitle={subtitle}>
          <PlusButton id="createDataSourceDesktopBtn" onClick={this.handleCreateDataSource} />
        </ContextHeader>
        <LoadingWrapper {...loadingConfig}>{this.renderList(!loading)}</LoadingWrapper>
        <NavigationContainer fixed hideOnDesktop>
          <BackArrowButton id="backBtn" onClick={this.handleShowProject} />
          <PlusButton id="createDataSourceBtn" onClick={this.handleCreateDataSource} />
        </NavigationContainer>
      </Container>
    );
  }
}
