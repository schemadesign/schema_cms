import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container, Tab, TabContent } from './tabs.styles';

export class Tabs extends PureComponent {
  static propTypes = {
    tabs: PropTypes.array,
  };

  renderTab = ({ to, active, content }, index) => (
    <Tab active={active} key={index}>
      <TabContent to={to}>{content}</TabContent>
    </Tab>
  );

  render() {
    const { tabs } = this.props;

    return <Container>{tabs.map(this.renderTab)}</Container>;
  }
}
