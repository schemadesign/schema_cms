import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icons, Header } from 'schemaUI';

import { renderWhenTrue } from '../../utils/rendering';
import { TopHeader } from '../topHeader';
import {
  Content,
  PrimaryList,
  SecondaryList,
  PrimaryItem,
  SecondaryItem,
  MenuHeader,
  closeButtonStyles,
} from '../topHeader/topHeader.styles';
import {
  Container,
  Overlayer,
  TopContainer,
  HeaderWrapper,
  Title,
  TitleWrapper,
  Actions,
  LogoLink,
  IconLink,
  menuStyles,
  headerCustomStyles,
  customButtonStyles,
} from './desktopTopHeader.styles';

const { ExitIcon, SchemaLogoIcon, UserIcon } = Icons;

export class DesktopTopHeader extends TopHeader {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    primaryMenuItems: PropTypes.array,
    secondaryMenuItems: PropTypes.array,
  };

  renderTitle = renderWhenTrue((_, title) => (
    <TitleWrapper>
      <Title>{title}</Title>
    </TitleWrapper>
  ));

  renderHeaderBar = title => (
    <HeaderWrapper>
      <LogoLink to="/">
        <SchemaLogoIcon />
      </LogoLink>
      {this.renderTitle(!!title, title)}
      <Actions>
        <IconLink to="/logout">
          <ExitIcon />
        </IconLink>
        <IconLink to="/user/me">
          <UserIcon />
        </IconLink>
      </Actions>
    </HeaderWrapper>
  );

  render() {
    const { title, primaryMenuItems, secondaryMenuItems } = this.props;

    const buttonProps = {
      onClick: this.handleToggleMenu,
      id: 'desktopTopHeaderOpenMenuButton',
    };
    const closeButtonProps = {
      customStyles: closeButtonStyles,
      id: 'desktopTopHeaderCloseMenuButton',
    };

    const primaryMenu = this.renderMenu(primaryMenuItems, PrimaryList, PrimaryItem);
    const secondaryMenu = this.renderMenu(secondaryMenuItems, SecondaryList, SecondaryItem);

    return (
      <TopContainer>
        <Container>
          <Header buttonProps={buttonProps} customStyles={headerCustomStyles} customButtonStyles={customButtonStyles}>
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
      </TopContainer>
    );
  }
}
