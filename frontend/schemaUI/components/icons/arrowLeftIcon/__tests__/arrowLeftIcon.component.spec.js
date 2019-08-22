import React from 'react';
import { shallow } from 'enzyme';

import { ArrowLeftIcon } from '../ArrowLeftIcon.component';

describe('ArrowLeftIcon: Component', () => {
  const defaultProps = {};

  const component = props => <ArrowLeftIcon {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const customStyles = {
      fill: 'blue',
    };

    const wrapper = render({ customStyles });
    global.expect(wrapper).toMatchSnapshot();
  });
});
