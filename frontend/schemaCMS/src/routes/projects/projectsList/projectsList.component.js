import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, Typography } from 'schemaUI';

import { Container, Description, Empty, HeaderItem, HeaderList, Item, List, urlStyles } from './projectsList.styles';

export class ProjectsList extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
  };

  renderHeader = (list = []) => (
    <HeaderList>
      {list.map((item, index) => (
        <HeaderItem key={index}>{item}</HeaderItem>
      ))}
    </HeaderList>
  );

  renderItem({ name = '', description = '', url = '', details }) {
    const header = this.renderHeader(details);
    const { H1, P, Span } = Typography;

    return (
      <Item>
        <Card headerComponent={header}>
          <H1>{name}</H1>
          <Description>
            <P>{description}</P>
          </Description>
          <Span customStyles={urlStyles}>{url}</Span>
        </Card>
      </Item>
    );
  }

  renderNoData = () => (
    <Empty>
      <Typography.P>No Projects</Typography.P>
    </Empty>
  );

  render() {
    const { list } = this.props;
    const count = list.length;

    return (
      <Container>{count ? <List>{list.map(item => this.renderItem(item))}</List> : this.renderNoData()}</Container>
    );
  }
}
