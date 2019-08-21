import React from 'react';
import { shallow } from 'enzyme';

import { P } from '../p.component';

describe('P: Component', () => {
  const defaultProps = {};

  const component = props => <P {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render children when passed in', () => {
    const wrapper = shallow(<P>Short paragraph</P>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const customStyles = { color: 'blue' };

    const wrapper = shallow(<P customStyles={customStyles}>Paragraph with custom styles</P>);

    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with attributes', () => {
    const wrapper = shallow(
      <P id="test-id" title="test title">
        Paragraph with attributes
      </P>
    );

    global.expect(wrapper).toMatchSnapshot();
  });
});
