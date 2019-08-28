import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';
import { identity } from 'ramda';

import { View } from '../view.component';

describe('View: Component', () => {
  const defaultProps = {
    fetchProject: identity,
    project: {},
    history: {},
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
      ...defaultProps,
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
