import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Button, Card, Icons, Typography } from 'schemaUI';

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
} from './list.styles';
import messages from './list.messages';
import extendedDayjs from '../../../../shared/utils/extendedDayjs';
import { HeaderItem, HeaderList } from '../../list/list.styles';

const { H1 } = Typography;
const { PlusIcon, CsvIcon } = Icons;

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

  handleShowDataSource = id =>
    this.props.history.push(`/project/view/${this.props.match.params.projectId}/dataSource/view/${id}`);

  renderHeader = (list = []) => (
    <HeaderList>
      {list.map((item, index) => (
        <HeaderItem key={index}>{item}</HeaderItem>
      ))}
    </HeaderList>
  );

  renderMetaData = ({ items, fields, filters, views }) => {
    const list = [
      { name: 'Source', value: <CsvIcon customStyles={{ width: 40, height: 40 }} /> },
      { name: 'Items', value: items || '000' },
      { name: 'Fields', value: fields || '00' },
      { name: 'Filters', value: filters || '00' },
      { name: 'Views', value: views || '00' },
    ];

    const elements = list.map(({ name, value }, index) => (
      <MetaData key={index}>
        <MetaDataName>{name}</MetaDataName>
        <MetaDataValue>{value}</MetaDataValue>
      </MetaData>
    ));

    return <MetaDataWrapper>{elements}</MetaDataWrapper>;
  };

  renderItem({ name, createdAt = '2019-08-29T07:23:50+0000', createdBy = 'Rafcio', id, metaData }, index) {
    const whenCreated = extendedDayjs(createdAt).fromNow();
    const header = this.renderHeader([whenCreated, createdBy]);

    return (
      <DataSourceItem key={index}>
        <Card headerComponent={header}>
          <H1 customStyles={titleStyles} onClick={() => this.handleShowDataSource(id)}>
            {name}
          </H1>
          {this.renderMetaData(metaData || {})}
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
