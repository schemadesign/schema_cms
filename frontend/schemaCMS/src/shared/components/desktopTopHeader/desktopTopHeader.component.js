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
  Container,
  HeaderWrapper,
  IconLink,
  Logo,
  LogoLink,
  Overlayer,
  Title,
  TitleWrapper,
  TopContainer,
  closeButtonStyles,
  customButtonStyles,
  headerCustomStyles,
  menuStyles,
  logoutButtonStyles,
} from './desktopTopHeader.styles';

const { ExitIcon, UserIcon } = Icons;

export class DesktopTopHeader extends TopHeader {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    primaryMenuItems: PropTypes.array,
    secondaryMenuItems: PropTypes.array,
    history: PropTypes.object,
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

  handleConfirmLogout = () => {
    this.handleCancelLogout();
    this.props.history.push('/logout');
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
    const { title, primaryMenuItems, secondaryMenuItems } = this.props;

    const buttonProps = {
      onClick: this.handleToggleMenu,
      id: 'desktopTopHeaderOpenMenuButton',
    };
    const closeButtonProps = {
      customStyles: closeButtonStyles,
      id: 'desktopTopHeaderCloseMenuButton',
    };

    const primaryMenu = this.renderMenuItems(primaryMenuItems, PrimaryList, PrimaryItem);
    const secondaryMenu = this.renderMenuItems(secondaryMenuItems, SecondaryList, SecondaryItem);

    return (
      <TopContainer>
        <Container>
          <Header
            buttonProps={buttonProps}
            customStyles={headerCustomStyles}
            customButtonStyles={customButtonStyles}
            showButton
          >
            {this.renderHeaderBar(title)}
          </Header>
          <Overlayer visible={this.state.isMenuOpen} />
          <Menu
            open={this.state.isMenuOpen}
            onClose={this.handleToggleMenu}
            customStyles={menuStyles}
            closeButtonProps={closeButtonProps}
          >
            <MenuHeader>{this.renderHeader('SchemaCMS', 'Menu')}</MenuHeader>
            <Content>
              {primaryMenu}
              {secondaryMenu}
            </Content>
          </Menu>
        </Container>
        <LogoutModal
          logoutModalOpen={logoutModalOpen}
          onConfirm={this.handleConfirmLogout}
          onCancel={this.handleCancelLogout}
        />
      </TopContainer>
    );
  }
}
