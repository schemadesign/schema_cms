import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Icons } from 'schemaUI';
import { always, cond, equals, find, ifElse, propEq, propOr, T } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { ProjectTabs } from '../../../shared/components/projectTabs';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ListContainer, ListItem, ListItemTitle } from '../../../shared/components/listComponents';
import { BackLink, NavigationContainer, PlusLink, LARGE_BUTTON_SIZE } from '../../../shared/components/navigation';
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
  PREVIEW_PAGE,
  SOURCE_PAGE,
  SOURCE_TYPE_API,
  SOURCE_TYPE_FILE,
  SOURCE_TYPE_GOOGLE_SHEET,
} from '../../../modules/dataSource/dataSource.constants';
import { filterMenuOptions, getMatchParam, isProcessingData } from '../../../shared/utils/helpers';
import { formatPrefixedNumber } from '../../../shared/utils/numberFormating';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions, PROJECT_DATASOURCE_ID } from '../project.constants';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { JOB_STATE_FAILURE } from '../../../modules/job/job.constants';

const { CsvIcon, GoogleSpreadsheetIcon, IntersectIcon, ApiIcon } = Icons;
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

  getDataSourcePage = ifElse(equals(null), always(SOURCE_PAGE), always(PREVIEW_PAGE));

  getShowDataSourceUrl = ({ id, activeJob }) => {
    const dataSourcePage = this.getDataSourcePage(activeJob);

    return `/datasource/${id}/${dataSourcePage}`;
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

  renderSourceIcon = metaProcessing =>
    cond([
      [
        equals(SOURCE_TYPE_FILE),
        always(<CsvIcon customStyles={getSourceIconStyles(this.props.theme, metaProcessing)} />),
      ],
      [
        equals(SOURCE_TYPE_GOOGLE_SHEET),
        always(<GoogleSpreadsheetIcon customStyles={getSourceIconStyles(this.props.theme, metaProcessing, 30)} />),
      ],
      [
        equals(SOURCE_TYPE_API),
        always(<ApiIcon customStyles={getSourceIconStyles(this.props.theme, metaProcessing, 30)} />),
      ],
    ]);

  renderMetaData = ({ metaData: { items, fields, filters }, metaProcessing, tags, type }) => {
    const {
      intl: { formatMessage },
    } = this.props;

    const list = [
      {
        name: formatMessage(messages.source),
        value: this.renderSourceIcon(metaProcessing)(type),
        isIcon: true,
      },
      { name: formatMessage(messages.items), value: formatPrefixedNumber(items) },
      { name: formatMessage(messages.fields), value: fields },
      { name: formatMessage(messages.filters), value: filters },
      { name: formatMessage(messages.tags), value: tags ? tags.length : '0' },
    ];
    const elements = list.map(({ name, value, isIcon }, index) => (
      <MetaData key={index} metaProcessing={metaProcessing}>
        <MetaDataName id={`metaItem-${index}`}>{name}</MetaDataName>
        <MetaDataValue id={`metaItemValue-${index}`} isIcon={isIcon}>
          {value || DEFAULT_VALUE}
        </MetaDataValue>
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
    noDataSourceUploaded,
  }) =>
    cond([
      [
        propEq('fileUploadingError', true),
        always(this.renderLoading(<FormattedMessage id="fileUploadingErrorStatus" {...messages.fileUploadingError} />)),
      ],
      [
        propEq('isUploading', true),
        always(
          this.renderLoading(
            <FormattedMessage id="fileUploadingStatus" {...messages.fileUploading} values={{ uploadProgress }} />
          )
        ),
      ],
      [
        propEq('noDataSourceUploaded', true),
        always(
          this.renderLoading(<FormattedMessage id="noDataSourceUploadedStatus" {...messages.noDataSourceUploaded} />)
        ),
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
      [
        propEq('jobFailed', true),
        always(this.renderLoading(<FormattedMessage id="dataWranglingErrorStatus" {...messages.jobFailed} />)),
      ],
      [T, always(this.renderCreatedInformation([whenCreated, `${firstName} ${lastName}`]))],
    ])({ metaFailed, jobProcessing, metaProcessing, isUploading, fileUploadingError, jobFailed, noDataSourceUploaded });

  renderItem = (
    { name, created, createdBy, id, tags, metaData, activeJob, jobsState = {}, fileName, googleSheet, apiUrl, type },
    index
  ) => {
    const { firstName = '—', lastName = '' } = createdBy || {};
    const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
    const jobFailed = propEq('lastJobStatus', JOB_STATE_FAILURE)(jobsState);
    const metaFailed = propEq('status', META_FAILED)(metaData);
    const { metaProcessing, jobProcessing } = isProcessingData({ jobsState, metaData });
    const noDataSourceUploaded = !fileName && !googleSheet && !apiUrl;
    const fileUploading = find(propEq('id', id), this.props.uploadingDataSources);
    const fileUploadingError = !!propOr(false, 'error', fileUploading);
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
      noDataSourceUploaded,
    });

    const footer = this.renderMetaData({ metaData, metaProcessing, tags, type });
    return (
      <ListItem id="dataSourceContainer" key={index} headerComponent={header} footerComponent={footer}>
        <ListItemTitle id="dataSourceTitle" to={this.getShowDataSourceUrl({ id, activeJob })}>
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
    const addDataSourceUrl = `/project/${getMatchParam(this.props, 'projectId')}/datasource/add`;

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
          <PlusLink id="createDataSourceDesktopBtn" to={addDataSourceUrl} size={LARGE_BUTTON_SIZE} />
        </ContextHeader>
        <LoadingWrapper {...loadingConfig}>{this.renderList(!loading)}</LoadingWrapper>
        <NavigationContainer fixed>
          <BackLink id="backBtn" to={`/project/${getMatchParam(this.props, 'projectId')}`} />
          <PlusLink hideOnDesktop id="createDataSourceBtn" to={addDataSourceUrl} size={LARGE_BUTTON_SIZE} />
        </NavigationContainer>
      </Container>
    );
  }
}
