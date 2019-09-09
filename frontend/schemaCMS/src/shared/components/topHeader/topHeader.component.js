import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, Menu, Typography } from 'schemaUI';

import {
  Container,
  Content,
  HeaderWrapper,
  MenuHeader,
  PrimaryList,
  SecondaryList,
  PrimaryItem,
  SecondaryItem,
  menuStyles,
  closeButtonStyles,
} from './topHeader.styles';
import { renderWhenTrueOtherwise } from '../../utils/rendering';

const { H1, H2 } = Typography;

export class TopHeader extends PureComponent {
  static propTypes = {
    headerTitle: PropTypes.string,
    headerSubtitle: PropTypes.string,
    primaryMenuItems: PropTypes.array,
    secondaryMenuItems: PropTypes.array,
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

  renderItem = Item => ({ label = '', to, onClick }, index) =>
    renderWhenTrueOtherwise(
      () => (
        <Item key={index}>
          <Link to={to}>{label}</Link>
        </Item>
      ),
      () => (
        <Item key={index} onClick={onClick}>
          {label}
        </Item>
      )
    )(!!to);

  renderMenu = (items = [], List, Item) => <List>{items.map(this.renderItem(Item))}</List>;

  renderHeader = (title, subtitle) => (
    <HeaderWrapper>
      <H2>{title}</H2>
      <H1>{subtitle}</H1>
    </HeaderWrapper>
  );

  render() {
    const { headerTitle, headerSubtitle, primaryMenuItems, secondaryMenuItems } = this.props;

    const headerContent = this.renderHeader(headerTitle, headerSubtitle);

    const primaryMenu = this.renderMenu(primaryMenuItems, PrimaryList, PrimaryItem);
    const secondaryMenu = this.renderMenu(secondaryMenuItems, SecondaryList, SecondaryItem);

    return (
      <Container>
        <Header onButtonClick={this.handleToggleMenu}>{headerContent}</Header>
        <Menu
          open={this.state.isMenuOpen}
          onClose={this.handleToggleMenu}
          customStyles={menuStyles}
          customCloseButtonStyles={closeButtonStyles}
        >
          <MenuHeader>{headerContent}</MenuHeader>
          <Content>
            {primaryMenu}
            {secondaryMenu}
          </Content>
        </Menu>
      </Container>
    );
  }
}
