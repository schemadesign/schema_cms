import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { isEmpty } from 'ramda';
import { Typography } from 'schemaUI';

import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { generateApiUrl } from '../../../shared/utils/helpers';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { Empty } from '../project.styles';
import messages from './list.messages';
import { Container, Description, HeaderItem, HeaderList, urlStyles, titleStyles } from './list.styles';
import { NavigationContainer, PlusButton } from '../../../shared/components/navigation';
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

  getHeaderAndMenuConfig = (headerTitle, headerSubtitle) => {
    const secondaryMenuItems = [{ label: this.formatMessage(messages.logOut), to: '/logout', id: 'logoutBtn' }];

    if (this.props.isAdmin) {
      secondaryMenuItems.push({ label: this.formatMessage(messages.users), to: '/user', id: 'userBtn' });
    }

    return {
      headerTitle,
      headerSubtitle,
      secondaryMenuItems,
    };
  };

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
        <LoadingWrapper loading={loading} noData={isEmpty(list)} noDataContent={this.formatMessage(messages.noProjects)}>
          {this.renderList(list)}
        </LoadingWrapper>
        {this.renderContent({ list, loading })}
        <NavigationContainer right hideOnDesktop>
          {this.renderAddButton(isAdmin, 'addProjectBtn')}
        </NavigationContainer>
      </Container>
    );
  }
}
