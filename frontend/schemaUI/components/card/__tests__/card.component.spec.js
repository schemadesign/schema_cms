import React from 'react';
import { mount } from 'enzyme';

import { Card } from '../card.component';

describe('Card: Component', () => {
  const defaultProps = {};

  const component = props => <Card {...defaultProps} {...props} />;

  const render = (props = {}) => mount(component(props));

  it('should render correctly', () => {
    const wrapper = render();

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render children when passed in', () => {
    const wrapper = mount(
      <Card>
        <div>
          <h1>Test</h1>
          <p>Content</p>
        </div>
      </Card>
    );

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render component  with custom style and with header', () => {
    const header = <h1 style={{ color: 'red' }}>header</h1>;
    const customStyles = { color: 'blue' };

    const wrapper = mount(
      <Card customStyles={customStyles} headerComponent={header}>
        <div>
          <p>Content</p>
        </div>
      </Card>
    );

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with attributes', () => {
    const customStyles = { color: 'blue' };
    const wrapper = mount(
      <Card customStyles={customStyles} id="test-id" title="test title">
        Card with attributes
      </Card>
    );

    global.expect(wrapper).toMatchSnapshot();
  });
});
