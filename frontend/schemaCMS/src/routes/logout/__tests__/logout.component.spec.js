import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

import { Logout } from '../logout.component';

describe('Logout: Component', () => {
  const defaultProps = {
    logout: Function.prototype,
  };

  const component = props => <Logout {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call logout function on componentDidMount', () => {
    const logout = spy();
    render({ logout });

    expect(logout).to.have.been.calledOnce;
  });
});
