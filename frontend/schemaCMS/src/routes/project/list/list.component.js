import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { always, isEmpty } from 'ramda';
import { Typography } from 'schemaUI';

import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { generateApiUrl } from '../../../shared/utils/helpers';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LogoutModal } from '../../../shared/components/logoutModal';
import messages from './list.messages';
import { Container, Description, HeaderItem, HeaderList, Footer, descriptionStyles, titleStyles } from './list.styles';
import { NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { ListItem, ListContainer } from '../../../shared/components/listComponents';

const { H1, P } = Typography;

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
    error: null,
    logoutModalOpen: false,
  };

  async componentDidMount() {
    try {
      await this.props.fetchProjectsList();
      this.setState({ loading: false });
    } catch (error) {
      this.setState({
        loading: false,
        error,
      });
    }
  }

  getHeaderAndMenuConfig = (headerTitle, headerSubtitle) => {
    const secondaryMenuItems = [
      { label: this.formatMessage(messages.logOut), onClick: this.handleLogout, id: 'logoutBtn' },
    ];

    if (this.props.isAdmin) {
      secondaryMenuItems.push({ label: this.formatMessage(messages.users), to: '/user', id: 'userBtn' });
    }

    return {
      headerTitle,
      headerSubtitle,
      secondaryMenuItems,
    };
  };

  getLoadingConfig = (list, loading, error) => ({
    loading,
    error,
    noData: !list.length,
    noDataContent: this.formatMessage(messages.noProjects),
  });

  formatMessage = value => this.props.intl.formatMessage(value);

  handleShowProject = id => () => this.props.history.push(`/project/${id}`);

  handleNewProject = () => this.props.history.push('/project/create/');

  handleLogout = () => {
    this.setState({
      logoutModalOpen: true,
    });
  };

  handleCancelLogout = () => {
    this.setState({
      logoutModalOpen: false,
    });
  };

  handleConfirmLogout = () => {
    this.props.history.push('/logout');
  };

  renderHeader = (list = []) => (
    <HeaderList>
      {list.map((item, index) => (
        <HeaderItem id={`headerItem-${index}`} key={index}>
          {item}
        </HeaderItem>
      ))}
    </HeaderList>
  );

  renderFooter = (index, slug) => <Footer id={`apiPath-${index}`}>{generateApiUrl(slug)}</Footer>;

  renderItem({ id, title = '', description = '', slug = '', created = '', status = '', owner = {} }, index) {
    const { firstName = '', lastName = '' } = owner;
    const user = isEmpty(firstName) ? lastName : `${firstName} ${lastName}`;
    const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();

    const statusValue = messages[status] ? this.formatMessage(messages[status]) : status;

    const handleShowProject = this.handleShowProject(id);
    const header = this.renderHeader([whenCreated, statusValue, user]);
    const footer = this.renderFooter(index, slug);

    return (
      <ListItem key={index} headerComponent={header} footerComponent={footer}>
        <H1 id={`projectName-${index}`} customStyles={titleStyles} onClick={handleShowProject}>
          {title}
        </H1>
        <Description onClick={handleShowProject} customStyles={descriptionStyles}>
          <P id={`projectDescription-${index}`}>{description}</P>
        </Description>
      </ListItem>
    );
  }

  renderList = list => <ListContainer>{list.map((item, index) => this.renderItem(item, index))}</ListContainer>;

  renderAddButton = (isAdmin, id) =>
    renderWhenTrue(always(<PlusButton id={id} onClick={this.handleNewProject} />))(isAdmin);

  render() {
    const { list = [], isAdmin } = this.props;
    const { loading, error, logoutModalOpen } = this.state;

    const title = this.formatMessage(messages.title);
    const subtitle = this.formatMessage(messages.overview);

    const topHeaderConfig = this.getHeaderAndMenuConfig(title, subtitle);
    const loadingConfig = this.getLoadingConfig(list, loading, error);

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader {...topHeaderConfig} />
        <ContextHeader title={title} subtitle={subtitle}>
          {this.renderAddButton(isAdmin, 'addProjectDesktopBtn')}
        </ContextHeader>
        <LoadingWrapper {...loadingConfig}>{this.renderList(list)}</LoadingWrapper>
        <NavigationContainer right hideOnDesktop>
          {this.renderAddButton(isAdmin, 'addProjectBtn')}
        </NavigationContainer>
        <LogoutModal
          logoutModalOpen={logoutModalOpen}
          onConfirm={this.handleConfirmLogout}
          onCancel={this.handleCancelLogout}
        />
      </Container>
    );
  }
}
