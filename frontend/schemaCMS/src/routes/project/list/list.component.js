import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Header, Icons, Typography } from 'schemaUI';

import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import {
  Container,
  Description,
  Empty,
  HeaderItem,
  HeaderList,
  ProjectItem,
  ProjectsList,
  headerStyles,
  urlStyles,
  addProjectStyles,
} from './list.styles';

const { H1, H2, P, Span } = Typography;

export class List extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    fetchProjectsList: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchProjectsList();
  }

  renderHeader = (list = []) => (
    <HeaderList>
      {list.map((item, index) => (
        <HeaderItem key={index}>{item}</HeaderItem>
      ))}
    </HeaderList>
  );

  renderItem({ name = '', description = '', slug = '', created = '', status = '', owner = '' }) {
    const header = this.renderHeader([created, status, owner]);

    return (
      <ProjectItem>
        <Card headerComponent={header}>
          <H1>{name}</H1>
          <Description>
            <P>{description}</P>
          </Description>
          <Span customStyles={urlStyles}>{slug}</Span>
        </Card>
      </ProjectItem>
    );
  }

  renderList = (_, list) => <ProjectsList>{list.map(item => this.renderItem(item))}</ProjectsList>;

  renderNoData = () => (
    <Empty>
      <P>No Projects</P>
    </Empty>
  );

  render() {
    const { list = [] } = this.props;
    const content = renderWhenTrueOtherwise(this.renderList, this.renderNoData)(Boolean(list.length), list);

    return (
      <Container>
        <Header customStyles={headerStyles}>
          <H2>Projects</H2>
          <H1>Overview</H1>
        </Header>
        {content}
        <Button customStyles={addProjectStyles}>
          <Icons.PlusIcon />
        </Button>
      </Container>
    );
  }
}
