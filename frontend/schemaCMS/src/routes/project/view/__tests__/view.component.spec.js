import React from 'react';
import { shallow } from 'enzyme';
import { Card } from 'schemaUI';

import { View } from '../view.component';
import { defaultProps } from '../view.stories';
import { LoadingWrapper } from '../../../../shared/components/loadingWrapper';
import { BackButton, NextButton } from '../../../../shared/components/navigation';
import { TextInput } from '../../../../shared/components/form/inputs/textInput';

describe('View: Component', () => {
  const component = props => <View {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', async () => {
    defaultProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render content correctly', async () => {
    defaultProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render();

    const content = wrapper.find(LoadingWrapper).dive();
    expect(content).toMatchSnapshot();
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchProject should return error';
    const wrapper = await render({
      fetchProject: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });

  it('should call fetchProject prop on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchProject');

    await render();

    expect(defaultProps.fetchProject).toHaveBeenCalledWith({ projectId: '100' });
  });

  it('should call removeProject on click delete project', async () => {
    defaultProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());
    jest.spyOn(defaultProps, 'removeProject');

    const wrapper = await render();

    wrapper
      .find(LoadingWrapper)
      .dive()
      .find('#deleteProjectDesktopBtn')
      .simulate('click');

    expect(wrapper.state().confirmationModalOpen).toBeTruthy();

    wrapper
      .find(NextButton)
      .last()
      .simulate('click');

    expect(defaultProps.removeProject).toHaveBeenCalledWith({ projectId: '100' });
  });

  it('should call handleSubmit on save', async () => {
    jest.spyOn(defaultProps, 'handleSubmit');

    const wrapper = await render();

    wrapper
      .find(NextButton)
      .first()
      .simulate('click');

    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });

  it('should call handleChange on change', async () => {
    jest.spyOn(defaultProps, 'handleChange');

    const wrapper = await render();

    wrapper
      .find(TextInput)
      .first()
      .simulate('change', { target: { value: 'new value', name: 'title' } });

    expect(defaultProps.handleChange).toHaveBeenCalled();
  });

  it('should hide modal on cancel delete project', async () => {
    defaultProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());

    const wrapper = await render();

    wrapper
      .find(LoadingWrapper)
      .dive()
      .find('#deleteProjectDesktopBtn')
      .simulate('click');

    expect(wrapper.state().confirmationModalOpen).toBeTruthy();

    wrapper.find(BackButton).simulate('click');

    expect(wrapper.state().confirmationModalOpen).toBeFalsy();
  });

  it('should redirect on click on card', async () => {
    defaultProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = await render();

    wrapper
      .find(LoadingWrapper)
      .dive()
      .find(Card)
      .first()
      .simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/project/100/datasource');
  });
});
