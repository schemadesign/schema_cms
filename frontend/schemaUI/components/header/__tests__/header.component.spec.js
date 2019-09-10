import React from 'react';
import { shallow } from 'enzyme';

import { Header } from '../header.component';
import { Button } from '../../button';

describe('Header: Component', () => {
  const defaultProps = {};

  const component = props => <Header {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with children and custom styles', () => {
    const props = {
      customStyles: {
        backgroundColor: '#FFF',
      },
      iconComponent: 'icon',
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call onButtonClick prop on button click if component is provided', () => {
    const onClick = jest.fn();
    const props = {
      buttonProps: { onClick },
    };
    const wrapper = render(props);

    wrapper.find(Button).simulate('click');

    global.expect(props.buttonProps.onClick).toHaveBeenCalled();
  });
});
