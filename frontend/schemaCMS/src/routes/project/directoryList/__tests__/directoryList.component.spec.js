import React from 'react';
import { shallow } from 'enzyme';

import { DirectoryList } from '../directoryList.component';
import { defaultProps } from '../directoryList.stories';
import { BackArrowButton, PlusButton } from '../../../../shared/components/navigation';
import { ListItemTitle } from '../../../../shared/components/listComponents/listItem.styles';

describe('DirectoryList: Component', () => {
  const component = props => <DirectoryList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchDirectories = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render();
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should fetch list', () => {
    jest.spyOn(defaultProps, 'fetchDirectories');
    render();

    expect(defaultProps.fetchDirectories).toBeCalledWith({ projectId: '1' });
  });

  it('should go back', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper.find(BackArrowButton).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/project/1');
  });

  it('should create on desktop', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper
      .find(PlusButton)
      .at(0)
      .simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/project/1/directory/create');
  });

  it('should create directory on mobile', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper
      .find(PlusButton)
      .at(1)
      .simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/project/1/directory/create');
  });

  it('should show directory', async () => {
    jest.spyOn(defaultProps.history, 'push');
    defaultProps.fetchDirectories = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render();
    await Promise.resolve();
    wrapper.find(ListItemTitle).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/directory/1');
  });
});
