import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Header, Icons, Menu, Typography } from 'schemaUI';
import { isEmpty } from 'ramda';

import extendedDayjs from '../../../shared/utils/extendedDayjs';
import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import { PROJECTS_PATH } from '../../../shared/utils/api.constants';
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
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isMenuOpen: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.props.fetchProjectsList();
  }

  componentDidUpdate() {
    this.setState({
      isLoading: false,
    });
  }

  handleToggleMenu = () => {
    const { isMenuOpen } = this.state;

    this.setState({
      isMenuOpen: !isMenuOpen,
    });
  };

  handleShowProject = id => () => this.props.history.push(`${PROJECTS_PATH}/${id}`);

  handleNewProject = () => {};

  renderHeader = (list = []) => (
    <HeaderList>
      {list.map((item, index) => (
        <HeaderItem key={index}>{item}</HeaderItem>
      ))}
    </HeaderList>
  );

  renderItem({ id, title = '', description = '', slug = '', created = '', status = '', owner = {} }) {
    const { firstName = '', lastName = '' } = owner;
    const user = isEmpty(firstName) ? lastName : `${firstName} ${lastName}`;
    const whenCreated = extendedDayjs(created).fromNow();

    const header = this.renderHeader([whenCreated, status, user]);

    return (
      <ProjectItem key={id} onClick={this.handleShowProject(id)}>
        <Card headerComponent={header}>
          <H1>{title}</H1>
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
    const { isMenuOpen } = this.state;

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
    const { isLoading } = this.state;

    const content = isLoading
      ? 'Loading'
      : renderWhenTrueOtherwise(this.renderList, this.renderNoData)(Boolean(list.length), list);

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
