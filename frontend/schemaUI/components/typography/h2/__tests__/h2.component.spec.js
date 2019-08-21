import React from 'react';
import { shallow } from 'enzyme';

import { H2 } from '../h2.component';

describe('H2: Component', () => {
  const defaultProps = {};

  const component = props => <H2 {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render children when passed in', () => {
    const wrapper = shallow(<H2>Super title</H2>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const customStyles = { color: 'blue' };

    const wrapper = shallow(<H2 customStyles={customStyles}>Blue title</H2>);

    global.expect(wrapper).toMatchSnapshot();
  });
});
