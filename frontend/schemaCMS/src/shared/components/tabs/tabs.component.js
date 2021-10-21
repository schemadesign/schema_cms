import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container, InnerContainer, Tab, TabContentLink, TabContentButton } from './tabs.styles';

export class Tabs extends PureComponent {
  static propTypes = {
    tabs: PropTypes.array,
    withRedirection: PropTypes.bool,
    hideOnMobile: PropTypes.bool,
  };

  static defaultProps = {
    withRedirection: true,
    hideOnMobile: true,
  };

  renderTab = ({ active, id, content, to, onClick }, index) => (
    <Tab active={active} key={index}>
      {this.props.withRedirection ? (
        <TabContentLink id={`${id}-tab-link`} to={to}>
          {content}
        </TabContentLink>
      ) : (
        <TabContentButton id={`${id}-tab-button`} onClick={onClick}>
          {content}
        </TabContentButton>
      )}
    </Tab>
  );

  render() {
    const { tabs, hideOnMobile } = this.props;

    return (
      <Container hideOnMobile={hideOnMobile}>
        <InnerContainer hideOnMobile={hideOnMobile}>{tabs.map(this.renderTab)}</InnerContainer>
      </Container>
    );
  }
}
