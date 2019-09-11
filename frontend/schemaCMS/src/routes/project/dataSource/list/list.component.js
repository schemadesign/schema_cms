import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Button, Card, Icons, Typography } from 'schemaUI';
import { always, anyPass, cond, equals, ifElse } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { TopHeader } from '../../../../shared/components/topHeader';
import {
  addDataSourceStyles,
  Container,
  DataSourceItem,
  DataSourceList,
  titleStyles,
  MetaDataWrapper,
  MetaData,
  MetaDataName,
  MetaDataValue,
  iconSourceStyles,
  Header,
  HeaderIcon,
  lockTextStyles,
  lockIconStyles,
  ErrorsWrapper,
  Error,
} from './list.styles';
import messages from './list.messages';
import extendedDayjs from '../../../../shared/utils/extendedDayjs';
import { HeaderItem, HeaderList } from '../../list/list.styles';
import {
  FIELDS_STEP,
  INITIAL_STEP,
  STATUS_DONE,
  STATUS_DRAFT,
  STATUS_ERROR,
  STATUS_PROCESSING,
  STATUS_READY_FOR_PROCESSING,
} from '../../../../modules/dataSource/dataSource.constants';
import { renderWhenTrueOtherwise } from '../../../../shared/utils/rendering';

const { H1 } = Typography;
const { PlusIcon, CsvIcon, IntersectIcon } = Icons;
const DEFAULT_VALUE = '—';

export class List extends PureComponent {
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
        to: `/project/view/${this.props.match.params.projectId}`,
      },
    ],
  });

  getStep = ifElse(equals(STATUS_DRAFT), always(INITIAL_STEP), always(FIELDS_STEP));

  handleCreateDataSource = () => {
    const projectId = this.props.match.params.projectId;

    this.props.createDataSource({ projectId });
  };

  handleShowDataSource = ({ id, status }) => {
    if ([STATUS_PROCESSING, STATUS_READY_FOR_PROCESSING].includes(status)) {
      return;
    }

    const step = this.getStep(status);

    this.props.history.push(`/project/view/${this.props.match.params.projectId}/datasource/view/${id}/${step}`);
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

  renderErrorMessage = () => <FormattedMessage {...messages.error} />;
  renderProcessingMessage = () => <FormattedMessage {...messages.processing} />;
  renderDraftMessage = () => <FormattedMessage {...messages.draft} />;

  renderHeader = (status, list) =>
    cond([
      [equals(STATUS_DONE), () => this.renderCreatedInformation(list)],
      [equals(STATUS_ERROR), this.renderErrorMessage],
      [anyPass([equals(STATUS_PROCESSING), equals(STATUS_READY_FOR_PROCESSING)]), this.renderProcessingMessage],
      [equals(STATUS_DRAFT), this.renderDraftMessage],
    ])(status);

  renderMetaData = ({ items, fields, filters, views }, isLock) => {
    const customIconStyles = isLock ? { ...iconSourceStyles, ...lockIconStyles } : iconSourceStyles;
    const { formatMessage } = this.props.intl;
    const list = [
      { name: formatMessage(messages.source), value: <CsvIcon customStyles={customIconStyles} /> },
      { name: formatMessage(messages.items), value: items },
      { name: formatMessage(messages.fields), value: fields },
      { name: formatMessage(messages.filters), value: filters },
      { name: formatMessage(messages.views), value: views },
    ];

    const elements = list.map(({ name, value }, index) => (
      <MetaData key={index}>
        <MetaDataName>{name}</MetaDataName>
        <MetaDataValue isLock={isLock}>{value || DEFAULT_VALUE}</MetaDataValue>
      </MetaData>
    ));

    return <MetaDataWrapper>{elements}</MetaDataWrapper>;
  };

  renderErrors = errorLog => errorLog.map((error, index) => <Error key={index}>{error}</Error>);

  renderCardErrors = errorLog => <ErrorsWrapper>{this.renderErrors(errorLog)}</ErrorsWrapper>;

  renderCardContent = ({ metaData, isLock, isError, errorLog = [] }) =>
    renderWhenTrueOtherwise(
      always(this.renderCardErrors(errorLog)),
      always(this.renderMetaData(metaData || {}, isLock))
    )(isError);

  renderItem = ({ name, created, createdBy: { firstName, lastName }, id, metaData, status, errorLog }, index) => {
    const isLock = status !== STATUS_DONE;
    const isError = status === STATUS_ERROR;
    const whenCreated = extendedDayjs(created).fromNow();
    const header = this.renderHeader(status, [whenCreated, `${firstName} ${lastName}`]);
    const customTitleStyles = isLock ? { ...titleStyles, ...lockTextStyles } : titleStyles;

    return (
      <DataSourceItem key={index}>
        <Card headerComponent={header}>
          <H1 customStyles={customTitleStyles} onClick={() => this.handleShowDataSource({ id, status })}>
            {name}
          </H1>
          {this.renderCardContent({ metaData, isLock, isError, errorLog })}
        </Card>
      </DataSourceItem>
    );
  };

  renderList = dataSources => <DataSourceList>{dataSources.map(this.renderItem)}</DataSourceList>;

  render() {
    const { dataSources = [] } = this.props;
    const topHeaderConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <TopHeader {...topHeaderConfig} />
        {this.renderList(dataSources)}
        <Button customStyles={addDataSourceStyles} onClick={this.handleCreateDataSource}>
          <PlusIcon />
        </Button>
      </Container>
    );
  }
}
