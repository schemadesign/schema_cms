import React from 'react';
import { shallow } from 'enzyme';

import { StateTag } from '../stateTag.component';
import { defaultProps } from '../stateTag.stories';

describe('StateTag: Component', () => {
  const component = props => <StateTag {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch tag categories', () => {
    jest.spyOn(defaultProps, 'fetchTagCategories');
    render();
    expect(defaultProps.fetchTagCategories).toBeCalledWith({ projectId: 1 });
  });
});
