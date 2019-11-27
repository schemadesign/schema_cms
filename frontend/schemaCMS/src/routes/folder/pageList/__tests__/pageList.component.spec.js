import React from 'react';
import { shallow } from 'enzyme';

import { PageList } from '../pageList.component';
import { defaultProps } from '../pageList.stories';
import { BackArrowButton, PlusButton } from '../../../../shared/components/navigation';
import { ListItemTitle } from '../../../../shared/components/listComponents/listItem.styles';

describe('PageList: Component', () => {
  const component = props => <PageList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const props = {
      fetchPages: jest.fn().mockReturnValue(Promise.resolve()),
      fetchFolder: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const wrapper = render(props);
    await Promise.resolve();
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should fetch list', async () => {
    jest.spyOn(defaultProps, 'fetchPages');
    jest.spyOn(defaultProps, 'fetchFolder');
    render();
    await Promise.resolve();
    await Promise.resolve();
    expect(defaultProps.fetchPages).toBeCalledWith({ folderId: '1' });
    expect(defaultProps.fetchFolder).toBeCalledWith({ folderId: '1' });
  });

  it('should go to folder list page', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper.find(BackArrowButton).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/project/1/folder');
  });

  it('should go to create page on desktop', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper
      .find(PlusButton)
      .at(0)
      .simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/folder/1/page');
  });

  it('should go to create page on mobile', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper
      .find(PlusButton)
      .at(1)
      .simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/folder/1/page');
  });

  it('should show page', async () => {
    jest.spyOn(defaultProps.history, 'push');
    defaultProps.fetchFolder = jest.fn().mockReturnValue(Promise.resolve());
    defaultProps.fetchPages = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render();
    await Promise.resolve();
    await Promise.resolve();
    wrapper.find(ListItemTitle).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/page/1');
  });
});
