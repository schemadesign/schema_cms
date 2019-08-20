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

  it('should fire function from props after click on icon', () => {
    const handleIconClick = spy();
    const props = {
      handleIconClick,
    };
    const wrapper = render(props);

    wrapper.find(Button).simulate('click');

    expect(props.handleIconClick).to.have.been.calledOnce;
  });
});
