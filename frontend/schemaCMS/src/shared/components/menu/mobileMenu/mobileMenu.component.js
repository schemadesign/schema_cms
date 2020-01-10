import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, Menu } from 'schemaUI';
import { always, ifElse, cond, propEq, T } from 'ramda';
import { FormattedMessage } from 'react-intl';

import {
  closeButtonStyles,
  Container,
  Content,
  HeaderWrapper,
  MenuHeader,
  menuStyles,
  Item,
  Subtitle,
  Title,
  List,
  Divider,
} from './mobileMenu.styles';
import messages from './mobileMenu.messages';
import { LogoutModal } from '../../logoutModal';
import { DIVIDER, LINK_ITEM } from './mobileMenu.constants';

const HELPER_LINKS = [
  { label: <FormattedMessage {...messages.about} />, to: '/', id: 'aboutNavBtn' },
  { label: <FormattedMessage {...messages.api} />, to: '/', id: 'apiNavBtn' },
  { label: <FormattedMessage {...messages.repository} />, to: '/', id: 'repositoryNavBtn' },
];

export class MobileMenu extends PureComponent {
  static propTypes = {
    headerTitle: PropTypes.node,
    headerSubtitle: PropTypes.node,
    options: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool,
  };

  state = {
    isMenuOpen: false,
    logoutModalOpen: false,
  };

  fixedMenuItems = [
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

  renderHeader = (title, subtitle) => (
    <HeaderWrapper>
      <Title id="headerTitle">{title}</Title>
      <Subtitle id="headerSubtitle">{subtitle}</Subtitle>
    </HeaderWrapper>
  );

  renderItem = ({ active, id, to, onClick = this.handleToggleMenu, label, hide }, index) => (
    <Item key={index} active={active} hide={hide}>
      {ifElse(
        always(label),
        always(
          <Link id={id} to={to} onClick={onClick}>
            {label}
          </Link>
        )
      )(active)}
    </Item>
  );

  renderOptions = (option, index) =>
    cond([
      [propEq('type', LINK_ITEM), () => this.renderItem(option, index)],
      [propEq('type', DIVIDER), () => always(<Divider />)],
      [T, () => this.renderItem(option, index)],
    ])(option);

  render() {
    const { headerTitle, headerSubtitle, options } = this.props;
    const { logoutModalOpen, isMenuOpen } = this.state;
    const headerContent = this.renderHeader(headerTitle, headerSubtitle);
    const buttonProps = {
      onClick: this.handleToggleMenu,
      id: 'topHeaderOpenMenuBtn',
    };

    const closeButtonProps = {
      customStyles: closeButtonStyles,
      id: 'topHeaderCloseMenuButton',
    };

    return (
      <Container>
        <Header buttonProps={buttonProps}>{headerContent}</Header>
        <Menu
          open={isMenuOpen}
          onClose={this.handleToggleMenu}
          customStyles={menuStyles}
          closeButtonProps={closeButtonProps}
        >
          <MenuHeader>{headerContent}</MenuHeader>
          <Content>
            <List>{options.map(this.renderOptions)}</List>
            <List>{this.fixedMenuItems}</List>
            <List>{HELPER_LINKS}</List>
          </Content>
        </Menu>
        <LogoutModal logoutModalOpen={logoutModalOpen} onAction={this.handleCancelLogout} redirectUrl="/logout" />
      </Container>
    );
  }
}
