import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import { AuthRoute } from '../authRoute.component';

describe('AuthRoute: Component', () => {
  const defaultProps = {
    isAuthenticated: false,
    requireAnonymous: false,
    isUserFetched: false,
    fetchCurrentUser: Function.prototype,
  };

  const component = props => <AuthRoute {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render a <Redirect /> to home page when user is authenticated, fetched and require anonymous', () => {
    const wrapper = render({ isAuthenticated: true, isUserFetched: true, requireAnonymous: true });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render null if user is not fetched', () => {
    const wrapper = render({ isUserFetched: false });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchCurrentUser if user is not fetched', () => {
    const fetchCurrentUser = spy();
    render({ isUserFetched: false, fetchCurrentUser });
    expect(fetchCurrentUser).to.have.been.calledOnce;
  });

  it('should render <Route> if user is logged and all criterias are met', () => {
    const wrapper = render({ isUserFetched: true, isAuthenticated: true, requireAnonymous: false });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render <Route> if is anonymous user', () => {
    const wrapper = render({ requireAnonymous: true, isUserFetched: true });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render <ExternalRedirect> if not authenticated', () => {
    const wrapper = render({ isUserFetched: true });
    global.expect(wrapper).toMatchSnapshot();
  });
});
