import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { BlockList } from '../blockList.component';
import { Link } from '../blockList.styles';
import { defaultProps } from '../blockList.stories';
import { BackArrowButton, PlusButton } from '../../../../shared/components/navigation';

describe('PageList: Component', () => {
  const component = props => <BlockList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const props = {
      fetchPage: jest.fn().mockReturnValue(Promise.resolve()),
      fetchBlocks: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const wrapper = render(props);
    await Promise.resolve();
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly form', async () => {
    const props = {
      fetchPage: jest.fn().mockReturnValue(Promise.resolve()),
      fetchBlocks: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const wrapper = render(props);

    await Promise.resolve();
    await Promise.resolve();

    const form = wrapper.find(Formik).dive();

    global.expect(form).toMatchSnapshot();
  });

  it('should go to main page when fetchBlocks fails', async () => {
    jest.spyOn(defaultProps.history, 'push');
    const props = {
      fetchBlocks: jest.fn().mockReturnValue(Promise.reject()),
      fetchPage: jest.fn().mockReturnValue(Promise.resolve()),
    };
    render(props);
    await Promise.resolve();
    await Promise.resolve();
    expect(defaultProps.history.push).toBeCalledWith('/');
  });

  it('should go to main page when fetchPage fails', async () => {
    jest.spyOn(defaultProps.history, 'push');
    const props = {
      fetchBlocks: jest.fn().mockReturnValue(Promise.resolve()),
      fetchPage: jest.fn().mockReturnValue(Promise.reject()),
    };
    render(props);
    await Promise.resolve();
    expect(defaultProps.history.push).toBeCalledWith('/');
  });

  it('should fetch list', async () => {
    jest.spyOn(defaultProps, 'fetchPage');
    jest.spyOn(defaultProps, 'fetchBlocks');
    render();
    await Promise.resolve();
    await Promise.resolve();
    expect(defaultProps.fetchPage).toBeCalledWith({ pageId: '1' });
    expect(defaultProps.fetchBlocks).toBeCalledWith({ pageId: '1' });
  });

  it('should go to page list page', async () => {
    const props = {
      fetchPage: jest.fn().mockReturnValue(Promise.resolve()),
      fetchBlocks: jest.fn().mockReturnValue(Promise.resolve()),
    };
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render(props);
    await Promise.resolve();
    await Promise.resolve();
    wrapper
      .find(Formik)
      .dive()
      .find(BackArrowButton)
      .simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/directory/1');
  });

  it('should go to create block', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper.find(PlusButton).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/page/1/block/create');
  });

  it('should have link to block', async () => {
    const props = {
      fetchPage: jest.fn().mockReturnValue(Promise.resolve()),
      fetchBlocks: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const wrapper = render(props);
    await Promise.resolve();
    await Promise.resolve();
    const link = wrapper
      .find(Formik)
      .dive()
      .find(Link)
      .at(1);

    expect(link.props('to').to).toBe('/block/2');
  });

  it('should submit form', async () => {
    jest.spyOn(defaultProps, 'setBlocks');
    const props = {
      fetchPage: jest.fn().mockReturnValue(Promise.resolve()),
      fetchBlocks: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const values = {
      blocks: ['1', '2'],
    };
    const wrapper = render(props);
    await Promise.resolve();
    await Promise.resolve();
    wrapper.find(Formik).prop('onSubmit')(values);

    expect(defaultProps.setBlocks).toBeCalledWith({ active: ['1', '2'], inactive: [], pageId: '1' });
  });
});
