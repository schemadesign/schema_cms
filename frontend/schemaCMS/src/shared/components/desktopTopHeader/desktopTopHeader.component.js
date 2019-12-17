import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icons, Menu } from 'schemaUI';

import { renderWhenTrue } from '../../utils/rendering';
import { LogoutModal } from '../logoutModal';
import { TopHeader } from '../topHeader';
import {
  Content,
  MenuHeader,
  PrimaryItem,
  PrimaryList,
  SecondaryItem,
  SecondaryList,
} from '../topHeader/topHeader.styles';
import {
  Actions,
  closeButtonStyles,
  Container,
  customButtonStyles,
  headerCustomStyles,
  HeaderWrapper,
  IconLink,
  Logo,
  LogoLink,
  logoutButtonStyles,
  menuStyles,
  Overlayer,
  Title,
  TitleWrapper,
  TopContainer,
} from './desktopTopHeader.styles';

const { ExitIcon, UserIcon } = Icons;

export class DesktopTopHeader extends TopHeader {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    isAdmin: PropTypes.bool.isRequired,
  };

  state = {
    logoutModalOpen: false,
  };

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

  renderTitle = renderWhenTrue((_, title) => (
    <TitleWrapper>
      <Title>{title}</Title>
    </TitleWrapper>
  ));

  renderHeaderBar = title => (
    <HeaderWrapper>
      <LogoLink to="/">
        <Logo />
      </LogoLink>
      {this.renderTitle(!!title, title)}
      <Actions>
        <Button onClick={this.handleLogout} customStyles={logoutButtonStyles}>
          <ExitIcon />
        </Button>
        <IconLink to="/settings">
          <UserIcon />
        </IconLink>
      </Actions>
    </HeaderWrapper>
  );

  render() {
    const { logoutModalOpen } = this.state;
    const { title } = this.props;

    const buttonProps = {
      onClick: this.handleToggleMenu,
      id: 'desktopTopHeaderOpenMenuButton',
    };
    const closeButtonProps = {
      customStyles: closeButtonStyles,
      id: 'desktopTopHeaderCloseMenuButton',
    };

    const primaryMenu = this.renderMenuItems(this.primaryMenuItems, PrimaryList, PrimaryItem);
    const secondaryMenu = this.renderMenuItems(this.secondaryMenuItems, SecondaryList, SecondaryItem);

    return (
      <TopContainer>
        <Container>
          <Header buttonProps={buttonProps} customStyles={headerCustomStyles} customButtonStyles={customButtonStyles}>
            {this.renderHeaderBar(title)}
          </Header>
          <Overlayer visible={this.state.isMenuOpen} onClick={this.handleToggleMenu} />
          <Menu
            open={this.state.isMenuOpen}
            onClose={this.handleToggleMenu}
            customStyles={menuStyles}
            closeButtonProps={closeButtonProps}
          >
            <MenuHeader>{this.renderHeader('SchemaCMS', 'Menu')}</MenuHeader>
            <Content onClick={this.handleToggleMenu}>
              {primaryMenu}
              {secondaryMenu}
            </Content>
          </Menu>
        </Container>
        <LogoutModal logoutModalOpen={logoutModalOpen} onAction={this.handleCancelLogout} redirectUrl="/logout" />
      </TopContainer>
    );
  }
}
