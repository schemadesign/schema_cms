import React from 'react';
import { shallow } from 'enzyme';

import { Breadcrumbs } from '../breadcrumbs.component';
import { defaultProps, withSymbol } from '../breadcrumbs.stories';
import { LinkItem } from '../../linkItem';
import { Span } from '../../typography/span';
import { H3 } from '../../typography/h3';

describe('Breadcrumbs: Component', () => {
  const component = props => (
    <Breadcrumbs {...defaultProps} {...props}>
      <LinkItem href="#">
        <Span>Details</Span>
        <H3>This is a page</H3>
      </LinkItem>
      <LinkItem href="#">
        <Span>Details</Span>
        <H3>This is an inner page</H3>
      </LinkItem>
      <LinkItem href="#">
        <Span>Details</Span>
        <H3>This is another inner page</H3>
      </LinkItem>
    </Breadcrumbs>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with a custom symbol', () => {
    const wrapper = render(withSymbol('/'));
    global.expect(wrapper).toMatchSnapshot();
  });
});
