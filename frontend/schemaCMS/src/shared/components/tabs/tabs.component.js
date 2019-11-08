import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container, Tab } from './tabs.styles';

export class Tabs extends PureComponent {
  static propTypes = {
    tabs: PropTypes.array,
  };

  renderTab = ({ to, active, content }, index) => (
    <Tab to={to} active={active} key={index}>
      {content}
    </Tab>
  );

  render() {
    const { tabs } = this.props;

    return <Container>{tabs.map(this.renderTab)}</Container>;
  }
}
