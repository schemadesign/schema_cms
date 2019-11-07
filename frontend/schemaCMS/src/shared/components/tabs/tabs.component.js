import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container, Tab } from './tabs.styles';

export class Tabs extends PureComponent {
  static propTypes = {
    tabs: PropTypes.array,
  };

  renderTab = ({ to, active, content }) => (
    <Tab to={to} active={active}>
      {content}
    </Tab>
  );

  render() {
    const { tabs } = this.props;

    return <Container>{tabs.map(this.renderTab)}</Container>;
  }
}
