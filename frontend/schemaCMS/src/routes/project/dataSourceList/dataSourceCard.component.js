import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'schemaUI';
import { always, cond, equals, find, propEq, propOr, T } from 'ramda';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { useTheme } from 'styled-components';

import { ListItem, ListItemTitle } from '../../../shared/components/listComponents';
import {
  Header,
  HeaderIcon,
  Loading,
  MetaData,
  MetaDataName,
  MetaDataValue,
  MetaDataWrapper,
  getSourceIconStyles,
} from './dataSourceList.styles';
import messages from './dataSourceList.messages';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { HeaderItem, HeaderList } from '../list/list.styles';
import { META_FAILED, PREVIEW_PAGE, RESULT_PAGE, SOURCE_PAGE } from '../../../modules/dataSource/dataSource.constants';
import { isProcessingData } from '../../../shared/utils/helpers';
import { JOB_STATE_FAILURE } from '../../../modules/job/job.constants';
import { formatPrefixedNumber } from '../../../shared/utils/numberFormating';

const { IntersectIcon, CsvIcon } = Icons;
const DEFAULT_VALUE = '—';

export const DataSourceCard = ({
  uploadingDataSources,
  name,
  created,
  createdBy,
  id,
  metaData,
  activeJob,
  jobsState = {},
  fileName,
  index,
}) => {
  const history = useHistory();
  const intl = useIntl();
  const theme = useTheme();
  const { firstName = '—', lastName = '' } = createdBy || {};
  const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
  const jobFailed = propEq('lastJobStatus', JOB_STATE_FAILURE)(jobsState);
  const metaFailed = propEq('status', META_FAILED)(metaData);
  const { metaProcessing, jobProcessing } = isProcessingData({ jobsState, metaData });
  const noDataSourceUploaded = !fileName;
  const fileUploading = find(propEq('id', id), uploadingDataSources);
  const fileUploadingError = !!propOr(false, 'error', fileUploading);
  const isUploading = !!fileUploading;
  const uploadProgress = fileUploading && fileUploading.progress;

  const getDataSourcePage = cond([
    [equals(null), always(SOURCE_PAGE)],
    [propEq('scripts', []), always(PREVIEW_PAGE)],
    [T, always(RESULT_PAGE)],
  ]);
  const handleShowDataSource = ({ id, activeJob }) => {
    const dataSourcePage = getDataSourcePage(activeJob);

    history.push(`/datasource/${id}/${dataSourcePage}`);
  };
  const renderCreatedInformation = list => (
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
  const renderMetaData = data => {
    const {
      metaData: { items, fields, filters, tags },
      metaProcessing,
    } = data;
    const { formatMessage } = intl;

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
  const renderLoading = message => (
    <Loading id="dataSourceStatus" metaProcessing>
      {message}
    </Loading>
  );
  const renderHeader = ({
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
        always(renderLoading(<FormattedMessage id="fileUploadingErrorStatus" {...messages.fileUploadingError} />)),
      ],
      [
        propEq('isUploading', true),
        always(
          renderLoading(
            <FormattedMessage id="fileUploadingStatus" {...messages.fileUploading} values={{ uploadProgress }} />
          )
        ),
      ],
      [
        propEq('noDataSourceUploaded', true),
        always(renderLoading(<FormattedMessage id="noDataSourceUploadedStatus" {...messages.noDataSourceUploaded} />)),
      ],
      [
        propEq('metaProcessing', true),
        always(renderLoading(<FormattedMessage id="metaProcessingStatus" {...messages.metaProcessing} />)),
      ],
      [
        propEq('metaFailed', true),
        always(renderLoading(<FormattedMessage id="metaProcessingErrorStatus" {...messages.metaFailed} />)),
      ],
      [
        propEq('jobProcessing', true),
        always(renderLoading(<FormattedMessage id="dataWranglingStatus" {...messages.jobProcessing} />)),
      ],
      [
        propEq('jobFailed', true),
        always(renderLoading(<FormattedMessage id="dataWranglingErrorStatus" {...messages.jobFailed} />)),
      ],
      [T, always(renderCreatedInformation([whenCreated, `${firstName} ${lastName}`]))],
    ])({
      metaFailed,
      jobProcessing,
      metaProcessing,
      isUploading,
      fileUploadingError,
      jobFailed,
      noDataSourceUploaded,
    });

  const header = renderHeader({
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
  const footer = renderMetaData({ metaData, metaProcessing });

  return (
    <ListItem id="dataSourceContainer" key={index} headerComponent={header} footerComponent={footer}>
      <ListItemTitle id="dataSourceTitle" onClick={() => handleShowDataSource({ id, activeJob })}>
        {name}
      </ListItemTitle>
    </ListItem>
  );
};

DataSourceCard.propTypes = {
  name: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  createdBy: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  metaData: PropTypes.object.isRequired,
  activeJob: PropTypes.object,
  jobsState: PropTypes.object.isRequired,
  fileName: PropTypes.string,
  index: PropTypes.number.isRequired,
  uploadingDataSources: PropTypes.array.isRequired,
};
