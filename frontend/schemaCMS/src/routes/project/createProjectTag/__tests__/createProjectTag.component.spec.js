import React from 'react';
import { shallow } from 'enzyme';

import { CreateProjectTag } from '../createProjectTag.component';
import { defaultProps } from '../createProjectTag.stories';
import { BackButton } from '../../../../shared/components/navigation';

describe('CreateDataSourceTag: Component', () => {
  const component = props => <CreateProjectTag {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should go back', () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render();

    wrapper.find(BackButton).simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/project/1/tag');
  });
});
