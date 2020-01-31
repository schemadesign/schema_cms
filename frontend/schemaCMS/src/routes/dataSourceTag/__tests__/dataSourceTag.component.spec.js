import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceTag } from '../dataSourceTag.component';
import { defaultProps } from '../dataSourceTag.stories';
import { Link } from '../../../theme/typography';
import { BackButton } from '../../../shared/components/navigation';

describe('DataSourceTag: Component', () => {
  const component = props => <DataSourceTag {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchTag = jest.fn().mockReturnValue(Promise.resolve({ datasource: '1' }));
    const wrapper = render(defaultProps);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchTag on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchTag');

    await render();

    expect(defaultProps.fetchTag).toHaveBeenCalled();
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchTag should return error';
    const wrapper = await render({
      fetchTag: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });

  it('should call removeTag on confirm button click', () => {
    jest.spyOn(defaultProps, 'removeTag');

    const wrapper = render();

    wrapper.find('#confirmRemovalBtn').simulate('click');

    expect(defaultProps.removeTag).toHaveBeenCalledWith({ dataSourceId: 1, tagId: 2 });
  });

  it('should show modal on click remove link', () => {
    const wrapper = render(editProps);

    wrapper.find(Link).simulate('click');

    expect(wrapper.state().confirmationModalOpen).toBeTruthy();
  });

  it('should hide modal on cancel', () => {
    const wrapper = render(editProps);

    wrapper.find(Link).simulate('click');

    wrapper
      .find(BackButton)
      .at(1)
      .simulate('click');

    expect(wrapper.state().confirmationModalOpen).toBeFalsy();
  });

  it('should go back', () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render();

    wrapper
      .find(BackButton)
      .at(0)
      .simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/datasource/1/tag');
  });
});
