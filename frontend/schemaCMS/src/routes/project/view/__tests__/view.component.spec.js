import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';
import { identity } from 'ramda';

import { View } from '../view.component';

describe('View: Component', () => {
  const defaultProps = {
    fetchProject: identity,
    unsetFetchedProject: identity,
    isFetchedProject: true,
    project: {},
    history: {
      push: identity,
    },
    match: {
      params: {
        id: '100',
      },
    },
  };

  const component = props => <View {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchProject prop on componentDidMount', async () => {
    const id = '1';
    const fetchProject = spy();
    const props = {
      fetchProject,
      match: {
        params: {
          id,
        },
      },
    };

    await render(props);

    expect(fetchProject).to.have.been.calledWith(id);
  });
});
