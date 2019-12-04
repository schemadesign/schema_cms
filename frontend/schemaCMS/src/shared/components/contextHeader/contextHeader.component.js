import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container, ContextContainer, Header, Title, Subtitle } from './contextHeader.styles';

export class ContextHeader extends PureComponent {
  static propTypes = {
    title: PropTypes.node,
    subtitle: PropTypes.node,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  };

  renderHeader = (title, subtitle) => (
    <Header>
      <Title id="desktopHeaderTitle">{title}</Title>
      <Subtitle id="desktopHeaderSubtitle">{subtitle}</Subtitle>
    </Header>
  );

  render() {
    const { title, subtitle, children } = this.props;

    return (
      <Container>
        {this.renderHeader(title, subtitle)}
        <ContextContainer>{children}</ContextContainer>
      </Container>
    );
  }
}
