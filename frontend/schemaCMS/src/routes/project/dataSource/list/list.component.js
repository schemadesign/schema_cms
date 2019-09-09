import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Button, Card, Icons, Typography } from 'schemaUI';
import { always, cond, equals } from 'ramda';
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
} from './list.styles';
import messages from './list.messages';
import extendedDayjs from '../../../../shared/utils/extendedDayjs';
import { HeaderItem, HeaderList } from '../../list/list.styles';
import {
  STATUS_DONE,
  STATUS_DRAFT,
  STATUS_ERROR,
  STATUS_PROCESSING,
} from '../../../../modules/dataSource/dataSource.constants';
import { renderWhenTrue } from '../../../../shared/utils/rendering';

const { H1 } = Typography;
const { PlusIcon, CsvIcon, IntersectIcon } = Icons;

export class List extends PureComponent {
  static propTypes = {
    createDataSource: PropTypes.func.isRequired,
    fetchDataSources: PropTypes.func.isRequired,
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

  handleCreateDataSource = () => {
    const projectId = this.props.match.params.projectId;

    this.props.createDataSource({ projectId });
  };

  handleShowDataSource = ({ id, status }) => {
    const step = status === STATUS_DRAFT ? 1 : 2;

    this.props.history.push(`/project/view/${this.props.match.params.projectId}/dataSource/view/${id}/${step}`);
  };

  renderHeader = (list = [], status) =>
    cond([
      [
        equals(STATUS_DONE),
        always(
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
        ),
      ],
      [equals(STATUS_ERROR), always(<FormattedMessage {...messages.error} />)],
      [equals(STATUS_PROCESSING), always(<FormattedMessage {...messages.processing} />)],
      [equals(STATUS_DRAFT), always(<FormattedMessage {...messages.draft} />)],
    ])(status);

  renderMetaData = ({ items, fields, filters, views }, isLock, isError) =>
    renderWhenTrue(() => {
      const customIconStyles = isLock ? { ...iconSourceStyles, ...lockIconStyles } : iconSourceStyles;
      const list = [
        { name: 'Source', value: <CsvIcon customStyles={customIconStyles} /> },
        { name: 'Items', value: items },
        { name: 'Fields', value: fields },
        { name: 'Filters', value: filters },
        { name: 'Views', value: views },
      ];

      const elements = list.map(({ name, value }, index) => (
        <MetaData key={index}>
          <MetaDataName>{name}</MetaDataName>
          <MetaDataValue isLock={isLock}>{value || '—'}</MetaDataValue>
        </MetaData>
      ));

      return <MetaDataWrapper>{elements}</MetaDataWrapper>;
    })(!isError);

  renderItem(
    {
      name,
      created,
      createdBy: { firstName, lastName },
      id,
      metaData,
      status,
    },
    index
  ) {
    const isLock = status !== STATUS_DONE;
    const isError = status === STATUS_ERROR;
    const isProcessing = status === STATUS_PROCESSING;
    const whenCreated = extendedDayjs(created).fromNow();
    const header = this.renderHeader([whenCreated, `${firstName} ${lastName}`], status);
    const customTitleStyles = isLock ? { ...titleStyles, ...lockTextStyles } : titleStyles;

    return (
      <DataSourceItem key={index}>
        <Card headerComponent={header}>
          <H1
            customStyles={customTitleStyles}
            onClick={() => (isProcessing ? {} : this.handleShowDataSource({ id, status }))}
          >
            {name}
          </H1>
          {this.renderMetaData(metaData || {}, isLock, isError)}
        </Card>
      </DataSourceItem>
    );
  }

  renderList = dataSources => (
    <DataSourceList>{dataSources.map((item, index) => this.renderItem(item, index))}</DataSourceList>
  );

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
