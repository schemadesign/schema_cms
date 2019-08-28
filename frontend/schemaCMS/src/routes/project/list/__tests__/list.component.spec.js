import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

import { List } from '../list.component';
import { defaultProps } from '../list.stories';

describe('List: Component', () => {
  const component = props => <List {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchProjectsList prop on componentDidMount', async () => {
    const fetchProjectsList = spy();
    const props = {
      fetchProjectsList,
      list: [],
      history: {},
    };

    await render(props);

    expect(fetchProjectsList).to.have.been.called;
  });
});
