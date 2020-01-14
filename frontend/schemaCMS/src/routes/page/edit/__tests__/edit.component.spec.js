import React from 'react';
import { shallow } from 'enzyme';

import { Edit } from '../edit.component';
import { defaultProps } from '../edit.stories';
import { Form } from '../edit.styles';

describe('Edit: Component', () => {
  const component = props => <Edit {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const fetchPage = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({
      fetchPage,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should return to folder list', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper.find('#backBtn').simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/folder/1');
  });

  it('should call fetchFilters on componentDidMount', async () => {
    const fetchPage = jest.spyOn(defaultProps, 'fetchPage');

    await render({
      fetchPage,
    });

    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it('should submit form', () => {
    jest.spyOn(defaultProps, 'handleSubmit');
    const wrapper = render();
    wrapper.find(Form).simulate('submit');

    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });

  it('should call removePage on confirm button click', () => {
    jest.spyOn(defaultProps, 'removePage');
    const wrapper = render();
    wrapper.find('#confirmRemovalBtn').simulate('click');

    expect(defaultProps.removePage).toHaveBeenCalledWith({ pageId: '1', folderId: '1' });
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchPage should return error';
    const wrapper = await render({
      fetchPage: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });
});
