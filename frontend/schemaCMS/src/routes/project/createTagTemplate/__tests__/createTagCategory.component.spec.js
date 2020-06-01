import React from 'react';
import { shallow } from 'enzyme';

import { CreateTagTemplate } from '../createTagTemplate.component';
import { defaultProps } from '../createTagTemplate.stories';
import { BackButton } from '../../../../shared/components/navigation';

describe('CreateDataSourceTag: Component', () => {
  const component = props => <CreateTagTemplate {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should go back', () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render();

    wrapper.find(BackButton).simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/project/projectId/tag-templates');
  });
});
