import React from 'react';
import { shallow } from 'enzyme';

import { Span } from '../span.component';

describe('Span: Component', () => {
  const defaultProps = {};

  const component = props => <Span {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render children when passed in', () => {
    const wrapper = shallow(<Span>Short text</Span>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const customStyles = { color: 'blue' };

    const wrapper = shallow(<Span customStyles={customStyles}>Span with styles</Span>);

    global.expect(wrapper).toMatchSnapshot();
  });
});
