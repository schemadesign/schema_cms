import React from 'react';
import { shallow } from 'enzyme';

import { FolderList } from '../folderList.component';
import { defaultProps } from '../folderList.stories';
import { BackArrowButton, PlusButton } from '../../../../shared/components/navigation';
import { ListItemTitle } from '../../../../shared/components/listComponents/listItem.styles';

describe('FolderList: Component', () => {
  const component = props => <FolderList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchFolders = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render();
    await Promise.resolve();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch list', () => {
    jest.spyOn(defaultProps, 'fetchFolders');
    render();

    expect(defaultProps.fetchFolders).toBeCalledWith({ projectId: '1' });
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

    expect(defaultProps.history.push).toBeCalledWith('/project/1/folder/create');
  });

  it('should create folder on mobile', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper
      .find(PlusButton)
      .at(1)
      .simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/project/1/folder/create');
  });

  it('should show folder', async () => {
    jest.spyOn(defaultProps.history, 'push');
    defaultProps.fetchFolders = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render();
    await Promise.resolve();
    wrapper.find(ListItemTitle).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/folder/1');
  });
});
