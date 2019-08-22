import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, Typography } from 'schemaUI';

import { Container, List, Item, Empty, HeaderList, HeaderItem } from './projectsList.styles';

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
          <P>{description}</P>
          <Span>{url}</Span>
        </Card>
      </Item>
    );
  }

  renderNoData = () => {
    const { P } = Typography;

    return (
      <Empty>
        <P>No Projects</P>
      </Empty>
    );
  };

  render() {
    const { list } = this.props;
    const count = list.length;

    return (
      <Container>{count ? <List>{list.map(item => this.renderItem(item))}</List> : this.renderNoData()}</Container>
    );
  }
}
