import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

import { UserList } from '../userList.component';
import { defaultProps, propsWithUsers } from '../userList.stories';

describe('UserList: Component', () => {
  const component = props => <UserList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with users', () => {
    const wrapper = render(propsWithUsers);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call clearProject prop on componentDidMount', async () => {
    const clearProject = spy();
    const props = {
      ...defaultProps,
      clearProject,
    };

    await render(props);

    expect(clearProject).to.have.been.called;
  });

  it('should call fetchProject prop on componentDidMount', async () => {
    const fetchProject = spy();
    const props = {
      ...defaultProps,
      fetchProject,
    };

    await render(props);

    expect(fetchProject).to.have.been.called;
  });
});
