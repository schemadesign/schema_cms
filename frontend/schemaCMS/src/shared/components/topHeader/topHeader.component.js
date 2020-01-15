import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, Menu } from 'schemaUI';
import { always, equals, ifElse, last, nth, path, pipe, split } from 'ramda';
import { FormattedMessage } from 'react-intl';

import {
  closeButtonStyles,
  Container,
  Content,
  HeaderWrapper,
  MenuHeader,
  menuStyles,
  PrimaryItem,
  PrimaryList,
  SecondaryItem,
  SecondaryList,
  Subtitle,
  Title,
} from './topHeader.styles';
import { renderWhenTrue, renderWhenTrueOtherwise } from '../../utils/rendering';
import messages from './topHeader.messages';
import { LogoutModal } from '../logoutModal';

export class TopHeader extends PureComponent {
  static propTypes = {
    headerTitle: PropTypes.node,
    headerSubtitle: PropTypes.node,
    primaryMenuItems: PropTypes.array,
    secondaryMenuItems: PropTypes.array,
    isAdmin: PropTypes.bool,
    hideProjects: PropTypes.bool,
    iconComponent: PropTypes.element,
    projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  static defaultProps = {
    primaryMenuItems: [],
    secondaryMenuItems: [],
  };

  state = {
    isMenuOpen: false,
    logoutModalOpen: false,
  };

  getIsActive = page =>
    pipe(
      path(['location', 'pathname']),
      split('/'),
      ifElse(data => !parseInt(last(data), 10), data => last(data), nth(-2)),
      equals(page)
    )(window);

  getProjectRoutes = ({ projectId }) =>
    ifElse(
      equals(true),
      always([]),
      always([
        {
          label: <FormattedMessage {...messages.projectDetails} />,
          to: `/project/${projectId}`,
          id: 'projectDetailsNavBtn',
          page: 'project',
        },
        {
          label: <FormattedMessage {...messages.projectDataSources} />,
          to: `/project/${projectId}/datasource`,
          id: 'dataSourceNavBtn',
          page: 'datasource',
        },
        {
          label: <FormattedMessage {...messages.projectPages} />,
          to: `/project/${projectId}/folder`,
          id: 'folderNavBtn',
          page: 'folder',
        },
      ])
    )(!projectId);

  primaryMenuItems = [
    {
      label: <FormattedMessage {...messages.projects} />,
      to: '/project',
      id: 'projectNavBtn',
      page: 'project',
      hide: this.props.hideProjects,
    },
    {
      label: <FormattedMessage {...messages.users} />,
      to: '/user',
      id: 'userNavBtn',
      page: 'user',
      hide: !this.props.isAdmin,
    },
  ];

  secondaryMenuItems = [
    { label: <FormattedMessage {...messages.about} />, to: '/', id: 'aboutNavBtn' },
    { label: <FormattedMessage {...messages.api} />, to: '/', id: 'apiNavBtn' },
    { label: <FormattedMessage {...messages.repository} />, to: '/', id: 'repositoryNavBtn' },
  ];

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

  handleToggleMenu = () => {
    const { isMenuOpen } = this.state;

    this.setState({
      isMenuOpen: !isMenuOpen,
    });
  };

  renderItem = Item => ({ label = '', to = '', onClick, id = null, page = '', hide = false }, index) =>
    renderWhenTrueOtherwise(
      always(
        <Item key={index} active={this.getIsActive(page)} hide={hide}>
          <Link id={id} to={to} onClick={this.handleToggleMenu}>
            {label}
          </Link>
        </Item>
      ),
      always(
        <Item id={id} key={index} onClick={onClick} active={this.getIsActive(page)} hide={hide}>
          {label}
        </Item>
      )
    )(!!to);

  renderMenuItems = (items = [], List, Item) =>
    renderWhenTrue(always(<List>{items.map(this.renderItem(Item))}</List>))(!!items.length);

  renderHeader = (title, subtitle) => (
    <HeaderWrapper>
      <Title id="headerTitle">{title}</Title>
      <Subtitle id="headerSubtitle">{subtitle}</Subtitle>
    </HeaderWrapper>
  );

  renderMenu = ({ headerContent }) => {
    const { primaryMenuItems, secondaryMenuItems, projectId } = this.props;
    const closeButtonProps = {
      customStyles: closeButtonStyles,
      id: 'topHeaderCloseMenuButton',
    };

    const bottomItems = secondaryMenuItems.concat(this.secondaryMenuItems);
    const topItems = [
      ...primaryMenuItems,
      ...this.primaryMenuItems,
      ...this.getProjectRoutes({ projectId }),
      {
        label: <FormattedMessage {...messages.settings} />,
        to: '/settings',
        id: 'settingsNavBtn',
        page: 'settings',
      },
      {
        label: <FormattedMessage {...messages.logOut} />,
        onClick: this.handleLogout,
        id: 'logoutNavBtn',
      },
    ];

    const primaryMenu = this.renderMenuItems(topItems, PrimaryList, PrimaryItem);
    const secondaryMenu = this.renderMenuItems(bottomItems, SecondaryList, SecondaryItem);

    return (
      <Menu
        open={this.state.isMenuOpen}
        onClose={this.handleToggleMenu}
        customStyles={menuStyles}
        closeButtonProps={closeButtonProps}
      >
        <MenuHeader>{headerContent}</MenuHeader>
        <Content>
          {primaryMenu}
          {secondaryMenu}
        </Content>
      </Menu>
    );
  };

  render() {
    const { headerTitle, headerSubtitle, iconComponent } = this.props;
    const { logoutModalOpen } = this.state;
    const headerContent = this.renderHeader(headerTitle, headerSubtitle);
    const buttonProps = {
      onClick: this.handleToggleMenu,
      id: 'topHeaderOpenMenuBtn',
    };

    return (
      <Container>
        <Header buttonProps={buttonProps} iconComponent={iconComponent}>
          {headerContent}
        </Header>
        {this.renderMenu({ headerContent })}
        <LogoutModal logoutModalOpen={logoutModalOpen} onAction={this.handleCancelLogout} redirectUrl="/logout" />
      </Container>
    );
  }
}
