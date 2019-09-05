import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Menu, Typography } from 'schemaUI';

import browserHistory from '../../utils/history';
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

const { H1, H2 } = Typography;

export class TopHeader extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    menu: PropTypes.shape({
      primaryItems: PropTypes.array,
      secondaryItems: PropTypes.array,
    }),
  };

  static defaultProps = {
    menu: {
      primaryItems: [],
      secondaryItems: [],
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      isMenuOpen: false,
    };
  }

  handleToggleMenu = () => {
    const { isMenuOpen } = this.state;

    this.setState({
      isMenuOpen: !isMenuOpen,
    });
  };

  handleItemClick = to => () => browserHistory.push(to);

  renderItem = Item => ({ label = '', to = '' }, index) => (
    <Item onClick={this.handleItemClick(to)} key={index}>
      {label}
    </Item>
  );

  renderMenu = (items = [], List, Item) => <List>{items.map(this.renderItem(Item))}</List>;

  renderHeader = (title, subtitle) => (
    <HeaderWrapper>
      <H2>{title}</H2>
      <H1>{subtitle}</H1>
    </HeaderWrapper>
  );

  render() {
    const {
      title,
      subtitle,
      menu: { primaryItems, secondaryItems },
    } = this.props;

    const headerContent = this.renderHeader(title, subtitle);

    const primaryMenu = this.renderMenu(primaryItems, PrimaryList, PrimaryItem);
    const secondaryMenu = this.renderMenu(secondaryItems, SecondaryList, SecondaryItem);

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
