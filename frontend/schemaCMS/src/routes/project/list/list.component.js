import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { always, cond, isEmpty, propEq, T } from 'ramda';
import { Typography } from 'schemaUI';

import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { generateApiUrl } from '../../../shared/utils/helpers';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { Empty } from '../project.styles';
import messages from './list.messages';
import { Container, Description, HeaderItem, HeaderList, urlStyles, titleStyles } from './list.styles';
import { NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { Loader } from '../../../shared/components/loader';
import { ListItem, ListContainer } from '../../../shared/components/listComponents';

const { H1, P, Span } = Typography;

export class List extends PureComponent {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    list: PropTypes.array.isRequired,
    fetchProjectsList: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    await this.props.fetchProjectsList();
    this.setState({ loading: false });
  }

  getHeaderAndMenuConfig = (headerTitle, headerSubtitle) => ({
    headerTitle,
    headerSubtitle,
    secondaryMenuItems: [
      { label: this.formatMessage(messages.users), to: '/user', id: 'userBtn' },
      { label: this.formatMessage(messages.logOut), to: '/logout', id: 'logoutBtn' },
    ],
  });

  formatMessage = value => this.props.intl.formatMessage(value);

  handleShowProject = id => () => this.props.history.push(`/project/${id}`);

  handleNewProject = () => this.props.history.push('/project/create/');

  renderHeader = (list = []) => (
    <HeaderList>
      {list.map((item, index) => (
        <HeaderItem id={`headerItem-${index}`} key={index}>
          {item}
        </HeaderItem>
      ))}
    </HeaderList>
  );

  renderItem({ id, title = '', description = '', slug = '', created = '', status = '', owner = {} }, index) {
    const { firstName = '', lastName = '' } = owner;
    const user = isEmpty(firstName) ? lastName : `${firstName} ${lastName}`;
    const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();

    const statusValue = messages[status] ? this.formatMessage(messages[status]) : status;

    const header = this.renderHeader([whenCreated, statusValue, user]);
    const handleShowProject = this.handleShowProject(id);

    return (
      <ListItem key={index} headerComponent={header}>
        <H1 id={`projectName-${index}`} customStyles={titleStyles} onClick={handleShowProject}>
          {title}
        </H1>
        <Description onClick={handleShowProject}>
          <P id={`projectDescription-${index}`}>{description}</P>
        </Description>
        <Span id={`apiPath-${index}`} customStyles={urlStyles}>
          {generateApiUrl(slug)}
        </Span>
      </ListItem>
    );
  }

  renderList = ({ list }) => <ListContainer>{list.map((item, index) => this.renderItem(item, index))}</ListContainer>;

  renderAddButton = (isAdmin, id) =>
    renderWhenTrue(always(<PlusButton id={id} onClick={this.handleNewProject} />))(isAdmin);

  renderNoData = () => (
    <Empty>
      <P>{this.props.intl.formatMessage(messages.noProjects)} </P>
    </Empty>
  );

  renderContent = cond([
    [propEq('loading', true), always(<Loader />)],
    [propEq('list', []), this.renderNoData],
    [T, this.renderList],
  ]);

  render() {
    const { list = [], isAdmin } = this.props;
    const { loading } = this.state;

    const title = this.formatMessage(messages.title);
    const subtitle = this.formatMessage(messages.overview);

    const topHeaderConfig = this.getHeaderAndMenuConfig(title, subtitle);

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader {...topHeaderConfig} />
        <ContextHeader title={title} subtitle={subtitle}>
          {this.renderAddButton(isAdmin, 'addProjectDesktopBtn')}
        </ContextHeader>
        {this.renderContent({ list, loading })}
        <NavigationContainer right hideOnDesktop>
          {this.renderAddButton(isAdmin, 'addProjectBtn')}
        </NavigationContainer>
      </Container>
    );
  }
}
