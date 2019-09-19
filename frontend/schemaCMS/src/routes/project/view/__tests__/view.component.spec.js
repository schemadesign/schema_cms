import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

import { View } from '../view.component';
import { defaultProps } from '../view.stories';

describe('View: Component', () => {
  const component = props => <View {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchProject prop on componentDidMount', async () => {
    const projectId = '1';
    const fetchProject = spy();
    const props = {
      fetchProject,
      match: {
        params: {
          projectId,
        },
      },
    };

    await render(props);

    expect(fetchProject).to.have.been.calledWith(projectId);
  });
});
