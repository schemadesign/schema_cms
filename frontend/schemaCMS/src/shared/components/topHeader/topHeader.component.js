import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, Menu } from 'schemaUI';
import { always, not, concat, isEmpty, pipe } from 'ramda';

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

export class TopHeader extends PureComponent {
  static propTypes = {
    headerTitle: PropTypes.node,
    headerSubtitle: PropTypes.node,
    primaryMenuItems: PropTypes.array,
    secondaryMenuItems: PropTypes.array,
  };

  static defaultProps = {
    primaryMenuItems: [],
    secondaryMenuItems: [],
  };

  state = {
    isMenuOpen: false,
  };

  handleToggleMenu = () => {
    const { isMenuOpen } = this.state;

    this.setState({
      isMenuOpen: !isMenuOpen,
    });
  };

  renderItem = Item => ({ label = '', to = '', onClick, id = null }, index) =>
    renderWhenTrueOtherwise(
      always(
        <Item key={index}>
          <Link id={id} to={to}>
            {label}
          </Link>
        </Item>
      ),
      always(
        <Item id={id} key={index} onClick={onClick}>
          {label}
        </Item>
      )
    )(!!to);

  renderMenuItems = (items = [], List, Item) => <List>{items.map(this.renderItem(Item))}</List>;

  renderHeader = (title, subtitle) => (
    <HeaderWrapper>
      <Title id="headerTitle">{title}</Title>
      <Subtitle id="headerSubtitle">{subtitle}</Subtitle>
    </HeaderWrapper>
  );

  renderMenu = ({ headerContent, showMenu }) =>
    renderWhenTrue(() => {
      const { primaryMenuItems, secondaryMenuItems } = this.props;
      const closeButtonProps = {
        customStyles: closeButtonStyles,
        id: 'topHeaderCloseMenuButton',
      };
      const primaryMenu = this.renderMenuItems(primaryMenuItems, PrimaryList, PrimaryItem);
      const secondaryMenu = this.renderMenuItems(secondaryMenuItems, SecondaryList, SecondaryItem);

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
    })(showMenu);

  render() {
    const { headerTitle, headerSubtitle, primaryMenuItems, secondaryMenuItems } = this.props;

    const headerContent = this.renderHeader(headerTitle, headerSubtitle);
    const showMenu = pipe(
      concat(secondaryMenuItems),
      isEmpty,
      not
    )(primaryMenuItems);

    const buttonProps = {
      onClick: this.handleToggleMenu,
      id: 'topHeaderOpenMenuBtn',
    };

    return (
      <Container>
        <Header buttonProps={buttonProps} showButton={showMenu}>
          {headerContent}
        </Header>
        {this.renderMenu({ headerContent, showMenu })}
      </Container>
    );
  }
}
