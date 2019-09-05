import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { isEmpty } from 'ramda';
import { Button, Card, Header, Icons, Typography } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import extendedDayjs from '../../../shared/utils/extendedDayjs';
import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import { generateApiUrl } from '../../../shared/utils/helpers';
import { Menu } from '../../../shared/components/menu';
import { Empty } from '../project.styles';
import messages from './list.messages';
import {
  Container,
  Description,
  HeaderItem,
  HeaderList,
  ProjectItem,
  ProjectsList,
  urlStyles,
  titleStyles,
  addProjectStyles,
} from './list.styles';

const { H1, H2, P, Span } = Typography;

export class List extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    fetchProjectsList: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isMenuOpen: false,
    };
  }

  componentDidMount() {
    this.props.fetchProjectsList();
  }

  handleToggleMenu = () => {
    const { isMenuOpen } = this.state;

    this.setState({
      isMenuOpen: !isMenuOpen,
    });
  };

  handleShowProject = id => () => this.props.history.push(`/project/view/${id}`);

  handleNewProject = () => this.props.history.push('/project/create/');

  renderHeader = (list = []) => (
    <HeaderList>
      {list.map((item, index) => (
        <HeaderItem key={index}>{item}</HeaderItem>
      ))}
    </HeaderList>
  );

  renderItem({ id, title = '', description = '', slug = '', created = '', status = '', owner = {} }, index) {
    const { firstName = '', lastName = '' } = owner;
    const user = isEmpty(firstName) ? lastName : `${firstName} ${lastName}`;
    const whenCreated = extendedDayjs(created).fromNow();

    const header = this.renderHeader([whenCreated, status, user]);
    const handleShowProject = this.handleShowProject(id);

    return (
      <ProjectItem key={index}>
        <Card headerComponent={header}>
          <H1 customStyles={titleStyles} onClick={handleShowProject}>
            {title}
          </H1>
          <Description onClick={handleShowProject}>
            <P>{description}</P>
          </Description>
          <Span customStyles={urlStyles}>{generateApiUrl(slug)}</Span>
        </Card>
      </ProjectItem>
    );
  }

  renderList = (_, list) => <ProjectsList>{list.map((item, index) => this.renderItem(item, index))}</ProjectsList>;

  renderNoData = () => (
    <Empty>
      <P>{this.props.intl.formatMessage(messages.noProjects)} </P>
    </Empty>
  );

  renderMenu = () => {
    const { isMenuOpen } = this.state;

    return <Menu open={isMenuOpen} onClose={this.handleToggleMenu} />;
  };

  render() {
    const { list = [] } = this.props;

    const content = renderWhenTrueOtherwise(this.renderList, this.renderNoData)(Boolean(list.length), list);

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <Header onButtonClick={this.handleToggleMenu}>
          <H2>
            <FormattedMessage {...messages.title} />
          </H2>
          <H1>
            <FormattedMessage {...messages.overview} />
          </H1>
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
