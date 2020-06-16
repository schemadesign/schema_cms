import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, Menu } from 'schemaUI';
import { always, ifElse, cond, propEq, T, isEmpty } from 'ramda';
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
  HelperLink,
  HelperList,
  customButtonStyles,
} from './mobileMenu.styles';
import messages from './mobileMenu.messages';
import { LogoutModal } from '../../logoutModal';
import { DIVIDER, LINK_ITEM, HELPER_LINK, SETTINGS_ID } from './mobileMenu.constants';
import { handleToggleMenu } from '../../../utils/helpers';

const HELPER_LINKS = [
  { label: <FormattedMessage {...messages.about} />, to: '/', id: 'aboutNavBtn', type: HELPER_LINK },
  { label: <FormattedMessage {...messages.api} />, to: '/', id: 'apiNavBtn', type: HELPER_LINK },
  { label: <FormattedMessage {...messages.repository} />, to: '/', id: 'repositoryNavBtn', type: HELPER_LINK },
];

export class MobileMenu extends PureComponent {
  static propTypes = {
    headerTitle: PropTypes.node,
    headerSubtitle: PropTypes.node,
    options: PropTypes.array,
    iconComponent: PropTypes.element,
    active: PropTypes.string,
  };

  static defaultProps = {
    options: [],
  };

  state = {
    isMenuOpen: false,
    logoutModalOpen: false,
  };

  componentWillUnmount() {
    document.documentElement.classList.remove('hideScroll');
  }

  handleToggleMenu = () => handleToggleMenu(this);

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

  renderHeader = (title, subtitle) => (
    <HeaderWrapper>
      <Title id="headerTitle">{title}</Title>
      <Subtitle id="headerSubtitle">{subtitle}</Subtitle>
    </HeaderWrapper>
  );

  renderItem = ({ id, to = '', onClick = this.handleToggleMenu, label }, index) => (
    <Item key={index} active={id === this.props.active}>
      {ifElse(
        isEmpty,
        always(<div onClick={onClick}>{label}</div>),
        always(
          <Link id={id} to={to} onClick={onClick}>
            {label}
          </Link>
        )
      )(to)}
    </Item>
  );

  renderHelperLink = ({ id, to, label }, index) => (
    <HelperLink key={index} id={id} to={to} onClick={this.handleToggleMenu}>
      {label}
    </HelperLink>
  );

  renderOptions = (option, index) =>
    cond([
      [propEq('type', LINK_ITEM), () => this.renderItem(option, index)],
      [propEq('type', HELPER_LINK), () => this.renderHelperLink(option, index)],
      [propEq('type', DIVIDER), () => always(<Divider />)],
      [T, () => this.renderItem(option, index)],
    ])(option);

  render() {
    const { headerTitle, headerSubtitle, options, iconComponent } = this.props;
    const { logoutModalOpen, isMenuOpen } = this.state;
    const headerContent = this.renderHeader(headerTitle, headerSubtitle);

    const buttonProps = {
      onClick: this.handleToggleMenu,
      id: 'topHeaderOpenMenuBtn',
      type: 'button',
    };

    const closeButtonProps = {
      customStyles: closeButtonStyles,
      id: 'topHeaderCloseMenuButton',
      type: 'button',
    };

    const fixedMenuItems = [
      {
        label: <FormattedMessage {...messages.settings} />,
        to: '/settings',
        id: SETTINGS_ID,
        type: LINK_ITEM,
        page: 'settings',
      },
      {
        label: <FormattedMessage {...messages.logOut} />,
        onClick: this.handleLogout,
        type: LINK_ITEM,
        id: 'logoutNavBtn',
      },
    ];

    return (
      <Container>
        <Header buttonProps={buttonProps} customButtonStyles={customButtonStyles} iconComponent={iconComponent}>
          {headerContent}
        </Header>
        <Menu
          open={isMenuOpen}
          onClose={this.handleToggleMenu}
          customStyles={menuStyles}
          closeButtonProps={closeButtonProps}
        >
          <Content>
            <MenuHeader>{headerContent}</MenuHeader>
            <List>{options.map(this.renderOptions)}</List>
            <List>{fixedMenuItems.map(this.renderOptions)}</List>
            <HelperList>{HELPER_LINKS.map(this.renderOptions)}</HelperList>
          </Content>
        </Menu>
        <LogoutModal logoutModalOpen={logoutModalOpen} onAction={this.handleCancelLogout} redirectUrl="/logout" />
      </Container>
    );
  }
}
