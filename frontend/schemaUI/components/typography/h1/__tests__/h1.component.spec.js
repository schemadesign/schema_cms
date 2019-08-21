import React from 'react';
import { shallow } from 'enzyme';

import { H1 } from '../h1.component';

describe('H1: Component', () => {
  const defaultProps = {};

  const component = props => <H1 {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render children when passed in', () => {
    const wrapper = shallow(<H1>Super title</H1>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const customStyles = { color: 'blue' };

    const wrapper = shallow(<H1 customStyles={customStyles}>Blue title</H1>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with attributes', () => {
    const wrapper = shallow(
      <H1 id="test-id" title="test title">
        Title with attributes
      </H1>
    );

    global.expect(wrapper).toMatchSnapshot();
  });
});
