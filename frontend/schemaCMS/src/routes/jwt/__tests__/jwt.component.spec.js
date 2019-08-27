import React from 'react';
import { shallow, render as componentRender } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

import { Jwt } from '../jwt.component';

describe('Jwt: Component', () => {
  const location = {
    state: {
      token: 'qwerty123',
      user: 'user123',
    },
  };

  const defaultProps = {
    getJwtToken: Function.prototype,
    location,
  };

  const component = props => <Jwt {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call getJwtToken prop on componentDidMount', async () => {
    const getJwtToken = spy();
    const props = {
      getJwtToken,
      location,
    };

    await render(props);

    expect(getJwtToken).to.have.been.calledWith(location.state.user, location.state.token);
  });
});
