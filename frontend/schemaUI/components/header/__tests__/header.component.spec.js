import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

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
    const onButtonClick = spy();
    const props = {
      onButtonClick,
    };
    const wrapper = render(props);

    wrapper.find(Button).simulate('click');

    expect(props.onButtonClick).to.have.been.calledOnce;
  });
});
