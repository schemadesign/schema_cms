import React from 'react';
import { shallow } from 'enzyme';

import { LinkItem } from '../linkItem.component';
import { defaultProps } from '../linkItem.stories';
import { Span } from '../../typography/span';
import { H3 } from '../../typography/h3';

describe('LinkItem: Component', () => {
  const component = props => (
    <LinkItem {...defaultProps} {...props}>
      <Span>test</Span>
      <H3>Item Title</H3>
    </LinkItem>
  );

  const componentWithRender = () => (
    <LinkItem {...defaultProps}>
      <Span>test</Span>
      <H3>Item Title</H3>
    </LinkItem>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with render function', () => {
    const wrapper = shallow(componentWithRender());
    global.expect(wrapper).toMatchSnapshot();
  });
});
