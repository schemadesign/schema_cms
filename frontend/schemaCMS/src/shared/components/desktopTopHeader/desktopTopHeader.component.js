import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icons, Menu } from 'schemaUI';
import { always } from 'ramda';

import { renderWhenTrue, renderWhenTrueOtherwise } from '../../utils/rendering';
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
  MenuWrapper,
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
    userId: PropTypes.string,
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

  renderTitle = title =>
    renderWhenTrue(
      always(
        <TitleWrapper>
          <Title title={title}>{title}</Title>
        </TitleWrapper>
      )
    )(!!title);

  renderHeaderBar = () => (
    <HeaderWrapper>
      <LogoLink to="/">
        <Logo />
      </LogoLink>
      {this.renderTitle(this.props.title)}
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

  renderHeader = ({ buttonProps, userId }) =>
    renderWhenTrueOtherwise(
      always(
        <Header buttonProps={buttonProps} customStyles={headerCustomStyles} customButtonStyles={customButtonStyles}>
          {this.renderHeaderBar()}
        </Header>
      ),
      always(
        <LogoLink to="/">
          <Logo />
        </LogoLink>
      )
    )(!!userId);

  render() {
    const { logoutModalOpen, isMenuOpen } = this.state;
    const { userId } = this.props;
    const buttonProps = {
      onClick: this.handleToggleMenu,
      id: 'desktopTopHeaderOpenMenuButton',
    };
    const closeButtonProps = {
      customStyles: closeButtonStyles,
      id: 'desktopTopHeaderCloseMenuButton',
    };

    const primaryMenu = userId && this.renderMenuItems(this.primaryMenuItems, PrimaryList, PrimaryItem);
    const secondaryMenu = this.renderMenuItems(this.secondaryMenuItems, SecondaryList, SecondaryItem);

    return (
      <TopContainer>
        <Container>
          {this.renderHeader({ buttonProps, userId })}
          <Overlayer visible={isMenuOpen} onClick={this.handleToggleMenu} />
          <MenuWrapper visible={isMenuOpen} onClick={this.handleToggleMenu}>
            <Menu
              open={isMenuOpen}
              onClose={this.handleToggleMenu}
              customStyles={menuStyles(isMenuOpen)}
              closeButtonProps={closeButtonProps}
            >
              <MenuHeader>{this.renderHeader('SchemaCMS', 'Menu')}</MenuHeader>
              <Content onClick={this.handleToggleMenu}>
                {primaryMenu}
                {secondaryMenu}
              </Content>
            </Menu>
          </MenuWrapper>
        </Container>
        <LogoutModal logoutModalOpen={logoutModalOpen} onAction={this.handleCancelLogout} redirectUrl="/logout" />
      </TopContainer>
    );
  }
}
