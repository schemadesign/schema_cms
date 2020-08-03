import React from 'react';
import { shallow } from 'enzyme';

import { View } from '../view.component';
import { defaultProps } from '../view.stories';
import { NextButton } from '../../../../shared/components/navigation';
import { TextInput } from '../../../../shared/components/form/inputs/textInput';
import { PROJECT_STATUSES } from '../../../../modules/project/project.constants';

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

    expect(wrapper).toMatchSnapshot();
  });

  it('should render content correctly for editor', async () => {
    defaultProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({ isAdmin: false });

    expect(wrapper).toMatchSnapshot();
  });

  it('should call removeProject on click delete project', async () => {
    defaultProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());
    jest.spyOn(defaultProps, 'removeProject');

    const wrapper = await render();

    wrapper.find('#deleteProjectDesktopBtn').simulate('click');

    expect(wrapper.state().confirmationModalOpen).toBeTruthy();

    wrapper
      .find('#projectConfirmationRemovalModalConfirmBtn')
      .last()
      .simulate('click');

    expect(defaultProps.removeProject).toHaveBeenCalledWith({ projectId: '100' });
  });

  it('should call setFieldValue on select published project status', async () => {
    defaultProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());
    jest.spyOn(defaultProps, 'setFieldValue');

    const wrapper = await render();

    wrapper
      .find('#projectStatusSelect')
      .props()
      .onSelect({ value: PROJECT_STATUSES.PUBLISHED });

    expect(wrapper.state().publishConfirmationModalOpen).toBeTruthy();

    wrapper
      .find('#projectPublishConfirmationModalConfirmBtn')
      .last()
      .simulate('click');

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('status', 'published');
  });

  it('should set publishConfirmationModalOpen to false', async () => {
    defaultProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());

    const wrapper = await render();

    wrapper
      .find('#projectStatusSelect')
      .props()
      .onSelect({ value: PROJECT_STATUSES.PUBLISHED });

    expect(wrapper.state().publishConfirmationModalOpen).toBeTruthy();

    wrapper
      .find('#projectConfirmationPublishModalCancelBtn')
      .last()
      .simulate('click');

    expect(wrapper.state().publishConfirmationModalOpen).toBeFalsy();
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

    wrapper.find('#deleteProjectDesktopBtn').simulate('click');

    expect(wrapper.state().confirmationModalOpen).toBeTruthy();

    wrapper.find('#projectConfirmationRemovalModalCancelBtn').simulate('click');

    expect(wrapper.state().confirmationModalOpen).toBeFalsy();
  });
});
