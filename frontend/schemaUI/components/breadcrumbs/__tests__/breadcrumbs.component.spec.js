import React, { Fragment } from 'react';
import { shallow } from 'enzyme';

import { Breadcrumbs } from '../breadcrumbs.component';
import { defaultProps, withSymbol } from '../breadcrumbs.stories';

describe('Breadcrumbs: Component', () => {
  const component = props => (
    <Breadcrumbs {...defaultProps} {...props}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
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
