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
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchFolder = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render();
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should return to folder list', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper.find('#backBtn').simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/project/1/folder');
  });

  it('should call fetchFolder on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchFolder');

    await render();

    expect(defaultProps.fetchFolder).toHaveBeenCalled();
  });

  it('should submit form', () => {
    jest.spyOn(defaultProps, 'handleSubmit');
    const wrapper = render();
    wrapper.find(Form).simulate('submit');

    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });

  it('should call removeFolder on confirm button click', () => {
    jest.spyOn(defaultProps, 'removeFolder');
    const wrapper = render();
    wrapper.find('#confirmRemovalBtn').simulate('click');

    expect(defaultProps.removeFolder).toHaveBeenCalledWith({ projectId: '1', folderId: '1' });
  });
});
