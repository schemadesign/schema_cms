import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { fromPairs, is, isNil, uniq } from 'ramda';
import { Menu as MenuComponent } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import messages from './menu.messages';
import {
  Container,
  Content,
  PrimaryList,
  SecondaryList,
  PrimaryItem,
  SecondaryItem,
  menuStyles,
  closeButtonStyles,
} from './menu.styles';

export class Menu extends PureComponent {
  static propTypes = {
    basePrimaryItems: PropTypes.array,
    baseSecondaryItems: PropTypes.array,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customCloseButtonStyles: PropTypes.object,
    customCloseIconStyles: PropTypes.object,
    customStyles: PropTypes.object,
    history: PropTypes.object,
    open: PropTypes.bool,
    primaryItems: PropTypes.array,
    secondaryItems: PropTypes.array,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    basePrimaryItems: [
      { name: 'dataSources', label: messages.dataSources },
      { name: 'charts', label: messages.charts, visible: false },
      { name: 'pages', label: messages.pages, visible: false },
      { name: 'users', label: messages.users },
    ],
    baseSecondaryItems: [
      { name: 'userSettings', label: messages.userSettings, visible: false },
      { name: 'adminSettings', label: messages.adminSettings, visible: false },
      { name: 'logOut', label: messages.logOut, path: '/logout' },
    ],
  };

  transformMenuList(list = []) {
    const names = [];
    const data = fromPairs(
      list.map(item => {
        const { name } = item;

        names.push(name);

        return [name, item];
      })
    );

    return { names, data };
  }

  prepareMenu(baseList = [], extendList = [], append = true) {
    const { names: baseNames, data: base } = this.transformMenuList(baseList);
    const { names: extendNames, data: extend } = this.transformMenuList(extendList);

    const names = append ? [...baseNames, ...extendNames] : [...extendNames, ...baseNames];

    const items = uniq(names)
      .map(name => ({ ...base[name], ...extend[name] }))
      .filter(({ visible }) => (isNil(visible) ? true : visible));

    return items;
  }

  generateLabel = label => (is(String, label) ? label : <FormattedMessage {...label} />);

  generateItem = Item => ({ label, path, onClick }, index) => {
    const handleClick = onClick ? onClick : () => this.handleChangeLocation(path);

    return (
      <Item onClick={handleClick} key={index}>
        {this.generateLabel(label)}
      </Item>
    );
  };

  generateMenu(base = [], extend = [], append, List, Item) {
    const items = this.prepareMenu(base, extend, append);

    return <List>{items.map(this.generateItem(Item))}</List>;
  }

  handleChangeLocation = path => (path ? this.props.history.push(path) : null);

  render() {
    const {
      basePrimaryItems,
      baseSecondaryItems,
      primaryItems,
      secondaryItems,
      children,
      customStyles,
      customCloseButtonStyles,
      ...restProps
    } = this.props;

    const primaryMenu = this.generateMenu(basePrimaryItems, primaryItems, true, PrimaryList, PrimaryItem);
    const secondaryMenu = this.generateMenu(baseSecondaryItems, secondaryItems, false, SecondaryList, SecondaryItem);
    const styles = { ...menuStyles, ...customStyles };
    const updatedCloseButtonStyles = { ...closeButtonStyles, ...customCloseButtonStyles };

    return (
      <Container>
        <MenuComponent customStyles={styles} customCloseButtonStyles={updatedCloseButtonStyles} {...restProps}>
          <Content>
            {primaryMenu}
            {children}
            {secondaryMenu}
          </Content>
        </MenuComponent>
      </Container>
    );
  }
}
