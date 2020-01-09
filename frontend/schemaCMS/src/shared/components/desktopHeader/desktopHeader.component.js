import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icons, Menu, Typography } from 'schemaUI';
import { always, equals, path, pipe, split, last } from 'ramda';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { renderWhenTrue, renderWhenTrueOtherwise } from '../../utils/rendering';
import { LogoutModal } from '../logoutModal';
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
  Content,
  PrimaryItem,
  List,
  SecondaryItem,
} from './desktopHeader.styles';
import { PRIMARY_OPTIONS, SECONDARY_OPTIONS } from './desktopHeader.constants';
import messages from './desktopHeader.messages';
import { filterMenuOptions } from '../../utils/helpers';

const { ExitIcon, UserIcon } = Icons;
const { H1, H2 } = Typography;

export class DesktopHeader extends PureComponent {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    userRole: PropTypes.string,
    userId: PropTypes.string,
  };

  state = {
    logoutModalOpen: false,
  };

  getIsActive = page =>
    pipe(
      path(['location', 'pathname']),
      split('/'),
      last,
      equals(page)
    )(window);

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

  renderTitle = title =>
    renderWhenTrue(
      always(
        <TitleWrapper>
          <Title id={'desktopTopHeaderProjectTitle'} title={title}>
            {title}
          </Title>
        </TitleWrapper>
      )
    )(!!title);

  renderHeaderBar = () => (
    <HeaderWrapper>
      {this.renderLogo}
      {this.renderTitle(this.props.title)}
      <Actions>
        <Button id={'desktopTopHeaderLogoutBtn'} onClick={this.handleLogout} customStyles={logoutButtonStyles}>
          <ExitIcon />
        </Button>
        <IconLink to="/settings">
          <UserIcon id={'desktopTopHeaderSettingsBtn'} />
        </IconLink>
      </Actions>
    </HeaderWrapper>
  );

  renderLogo = (
    <LogoLink to="/">
      <Logo id={'desktopTopHeaderSchemaLogo'} />
    </LogoLink>
  );

  renderHeader = ({ buttonProps, userId }) =>
    renderWhenTrueOtherwise(
      always(
        <Header buttonProps={buttonProps} customStyles={headerCustomStyles} customButtonStyles={customButtonStyles}>
          {this.renderHeaderBar()}
        </Header>
      ),
      always(this.renderLogo)
    )(!!userId);

  renderItem = Item => ({ label = '', to = '', id = null, page = '' }, index) => (
    <Item key={index} active={this.getIsActive(page)}>
      <Link id={id} to={to} onClick={this.handleToggleMenu}>
        {label}
      </Link>
    </Item>
  );

  render() {
    const { logoutModalOpen, isMenuOpen } = this.state;
    const { userId, userRole } = this.props;
    const buttonProps = {
      onClick: this.handleToggleMenu,
      id: 'desktopTopHeaderOpenMenuButton',
    };
    const closeButtonProps = {
      customStyles: closeButtonStyles,
      id: 'desktopTopHeaderCloseMenuButton',
    };
    const mainOptions = filterMenuOptions(PRIMARY_OPTIONS, userRole);

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
              <H2>
                <FormattedMessage {...messages.title} />
              </H2>
              <H1>
                <FormattedMessage {...messages.subtitle} />
              </H1>
              <Content onClick={this.handleToggleMenu}>
                <List>{mainOptions.map(this.renderItem(PrimaryItem))}</List>
                <List>{SECONDARY_OPTIONS.map(this.renderItem(SecondaryItem))}</List>
              </Content>
            </Menu>
          </MenuWrapper>
        </Container>
        <LogoutModal logoutModalOpen={logoutModalOpen} onAction={this.handleCancelLogout} redirectUrl="/logout" />
      </TopContainer>
    );
  }
}
