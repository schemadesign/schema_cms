import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, Menu } from 'schemaUI';
import { always, equals, ifElse } from 'ramda';
import { FormattedMessage } from 'react-intl';

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
import messages from './topHeader.messages';
import { LogoutModal } from '../logoutModal';

export class TopHeader extends PureComponent {
  static propTypes = {
    headerTitle: PropTypes.node,
    headerSubtitle: PropTypes.node,
    primaryMenuItems: PropTypes.array,
    secondaryMenuItems: PropTypes.array,
    projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  static defaultProps = {
    primaryMenuItems: [],
    secondaryMenuItems: [],
  };

  state = {
    isMenuOpen: false,
    logoutModalOpen: false,
  };

  getProjectRoutes = ({ projectId }) =>
    ifElse(
      equals(true),
      always([]),
      always([
        {
          label: <FormattedMessage {...messages.projectDetails} />,
          to: `/project/${projectId}`,
        },
        {
          label: <FormattedMessage {...messages.projectDataSources} />,
          to: `/project/${projectId}/datasource`,
        },
        {
          label: <FormattedMessage {...messages.projectPages} />,
          to: `/project/${projectId}/folder`,
        },
      ])
    )(!projectId);

  primaryMenuItems = [{ label: <FormattedMessage {...messages.project} />, to: '/project' }];

  secondaryMenuItems = [
    { label: <FormattedMessage {...messages.about} />, to: '/' },
    { label: <FormattedMessage {...messages.api} />, to: '/' },
    { label: <FormattedMessage {...messages.repository} />, to: '/' },
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

  renderMenuItems = (items = [], List, Item) =>
    renderWhenTrue(always(<List>{items.map(this.renderItem(Item))}</List>))(!!items.length);

  renderHeader = (title, subtitle) => (
    <HeaderWrapper>
      <Title id="headerTitle">{title}</Title>
      <Subtitle id="headerSubtitle">{subtitle}</Subtitle>
    </HeaderWrapper>
  );

  renderMenu = ({ headerContent }) => {
    const { primaryMenuItems, secondaryMenuItems, projectId } = this.props;
    const closeButtonProps = {
      customStyles: closeButtonStyles,
      id: 'topHeaderCloseMenuButton',
    };

    const bottomItems = secondaryMenuItems.concat(this.secondaryMenuItems);
    const topItems = [
      ...primaryMenuItems,
      ...this.primaryMenuItems,
      ...this.getProjectRoutes({ projectId }),
      {
        label: <FormattedMessage {...messages.logOut} />,
        onClick: this.handleLogout,
        id: 'logoutBtn',
      },
    ];

    const primaryMenu = this.renderMenuItems(topItems, PrimaryList, PrimaryItem);
    const secondaryMenu = this.renderMenuItems(bottomItems, SecondaryList, SecondaryItem);

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
  };

  render() {
    const { headerTitle, headerSubtitle } = this.props;
    const { logoutModalOpen } = this.state;

    const headerContent = this.renderHeader(headerTitle, headerSubtitle);

    const buttonProps = {
      onClick: this.handleToggleMenu,
      id: 'topHeaderOpenMenuBtn',
    };

    return (
      <Container>
        <Header buttonProps={buttonProps}>{headerContent}</Header>
        {this.renderMenu({ headerContent })}
        <LogoutModal logoutModalOpen={logoutModalOpen} onAction={this.handleCancelLogout} redirectUrl="/logout" />
      </Container>
    );
  }
}
