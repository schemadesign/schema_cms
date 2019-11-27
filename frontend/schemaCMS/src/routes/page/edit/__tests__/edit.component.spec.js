import React from 'react';
import { shallow } from 'enzyme';

import { Edit } from '../edit.component';
import { defaultProps } from '../edit.stories';
import { BackButton } from '../../../../shared/components/navigation';
import { Form } from '../edit.styles';

describe('Edit: Component', () => {
  const component = props => <Edit {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchPage = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render();
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should return to folder list', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper.find(BackButton).simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/folder/1');
  });

  it('should submit form', () => {
    jest.spyOn(defaultProps, 'handleSubmit');
    const wrapper = render();
    wrapper.find(Form).simulate('submit');

    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });
});
