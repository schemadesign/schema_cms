import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

import { ResetPassword } from '../resetPassword.component';

describe('ResetPassword: Component', () => {
  const defaultProps = {
    resetPassword: Function.prototype,
  };

  const component = props => <ResetPassword {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call resetPassword function on componentDidMount', () => {
    const resetPassword = spy();
    render({ resetPassword });

    expect(resetPassword).to.have.been.calledOnce;
  });
});
