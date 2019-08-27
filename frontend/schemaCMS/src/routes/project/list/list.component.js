import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Header, Icons, Menu, Typography } from 'schemaUI';
import { isEmpty } from 'ramda';

import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import {
  Action,
  ActionsList,
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
    isMenuOpen: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchProjectsList();
  }

  handleToggleMenu = () => {
    this.props.toggleMenu();
  };

  handleNewProject = () => {};

  renderHeader = (list = []) => (
    <HeaderList>
      {list.map((item, index) => (
        <HeaderItem key={index}>{item}</HeaderItem>
      ))}
    </HeaderList>
  );

  renderItem({ name = '', description = '', slug = '', created = '', status = '', owner = {} }) {
    const { firstName = '', lastName = '' } = owner;
    const user = isEmpty(firstName) ? lastName : `${firstName} ${lastName}`;

    const header = this.renderHeader([created, status, user]);

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

  renderMenu = () => {
    const { isMenuOpen } = this.props;

    return (
      <Menu open={isMenuOpen} onClose={this.handleToggleMenu}>
        <ActionsList>
          <Action>Edit Project settings</Action>
          <Action>Delete project</Action>
          <Action>User settings</Action>
          <Action>Log Out</Action>
        </ActionsList>
      </Menu>
    );
  };

  render() {
    const { list = [] } = this.props;
    const content = renderWhenTrueOtherwise(this.renderList, this.renderNoData)(Boolean(list.length), list);

    return (
      <Container>
        <Header customStyles={headerStyles} onButtonClick={this.handleToggleMenu}>
          <H2>Projects</H2>
          <H1>Overview</H1>
        </Header>
        {content}
        <Button customStyles={addProjectStyles} onClick={this.handleNewProject}>
          <Icons.PlusIcon />
        </Button>
        {this.renderMenu()}
      </Container>
    );
  }
}
