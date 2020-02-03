import React from 'react';
import { shallow } from 'enzyme';

import { CreateDataSourceTag } from '../createDataSourceTag.component';
import { defaultProps } from '../createDataSourceTag.stories';
import { BackButton } from '../../../../shared/components/navigation';

describe('CreateDataSourceTag: Component', () => {
  const component = props => <CreateDataSourceTag {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should go back', () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render();

    wrapper.find(BackButton).simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/datasource/dataSourceId/tag');
  });
});
