import React from 'react';
import { shallow } from 'enzyme';
import { Typography } from 'schemaUI';

import { PageList } from '../pageList.component';
import { defaultProps } from '../pageList.stories';
import { BackArrowButton, PlusButton } from '../../../../shared/components/navigation';

const { H1 } = Typography;

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
      fetchDirectory: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const wrapper = render(props);
    await Promise.resolve();
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should go to main page when fetchPages fails', async () => {
    jest.spyOn(defaultProps.history, 'push');
    const props = {
      fetchDirectory: jest.fn().mockReturnValue(Promise.resolve()),
      fetchPages: jest.fn().mockReturnValue(Promise.reject()),
    };
    render(props);
    await Promise.resolve();
    await Promise.resolve();
    expect(defaultProps.history.push).toBeCalledWith('/');
  });

  it('should go to main pag when fetchDirectory fails', async () => {
    jest.spyOn(defaultProps.history, 'push');
    const props = {
      fetchDirectory: jest.fn().mockReturnValue(Promise.reject()),
      fetchPages: jest.fn().mockReturnValue(Promise.resolve()),
    };
    render(props);
    await Promise.resolve();
    expect(defaultProps.history.push).toBeCalledWith('/');
  });

  it('should fetch list', async () => {
    jest.spyOn(defaultProps, 'fetchPages');
    jest.spyOn(defaultProps, 'fetchDirectory');
    render();
    await Promise.resolve();
    await Promise.resolve();
    expect(defaultProps.fetchPages).toBeCalledWith({ directoryId: '1' });
    expect(defaultProps.fetchDirectory).toBeCalledWith({ directoryId: '1' });
  });

  it('should go to directory list page', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper.find(BackArrowButton).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/project/1/directory');
  });

  it('should go to create page on desktop', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper
      .find(PlusButton)
      .at(0)
      .simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/directory/1/page');
  });

  it('should go to create page on mobile', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper
      .find(PlusButton)
      .at(1)
      .simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/directory/1/page');
  });

  it('should show page', async () => {
    jest.spyOn(defaultProps.history, 'push');
    defaultProps.fetchDirectory = jest.fn().mockReturnValue(Promise.resolve());
    defaultProps.fetchPages = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render();
    await Promise.resolve();
    await Promise.resolve();
    wrapper.find(H1).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/page/1');
  });
});
