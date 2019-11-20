import React from 'react';
import { shallow } from 'enzyme';

import { StepNavigation } from '../stepNavigation.component';
import { defaultProps, nextStepProps, lastStepProps } from '../stepNavigation.stories';
import { BackButton, NextButton } from '../../navigation';

describe('StepNavigation: Component', () => {
  const component = props => <StepNavigation {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with next step', () => {
    const wrapper = render(nextStepProps);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should hide next button on last step', () => {
    const wrapper = render(lastStepProps);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should show loading', () => {
    nextStepProps.loading = true;
    const wrapper = render(nextStepProps);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should change to second step', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper.find(NextButton).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/datasource/1/2');
  });

  it('should change to third step', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render(nextStepProps);
    wrapper.find(BackButton).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/datasource/1/3');
  });

  it('should submit form', () => {
    nextStepProps.submitForm = Function.prototype;
    jest.spyOn(nextStepProps, 'submitForm');
    const wrapper = render(nextStepProps);
    wrapper.find(NextButton).simulate('click');

    expect(nextStepProps.submitForm).toBeCalled();
  });
});
