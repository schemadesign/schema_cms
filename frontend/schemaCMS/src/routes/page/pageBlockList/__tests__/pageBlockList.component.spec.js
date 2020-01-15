import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { PageBlockList } from '../pageBlockList.component';
import { Link } from '../pageBlockList.styles';
import { defaultProps } from '../pageBlockList.stories';
import { BackArrowButton, PlusButton } from '../../../../shared/components/navigation';

describe('PageBlockList: Component', () => {
  const component = props => <PageBlockList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const props = {
      fetchPage: jest.fn().mockReturnValue(Promise.resolve()),
      fetchPageBlocks: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const wrapper = render(props);
    await Promise.resolve();
    await Promise.resolve();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly form', async () => {
    const props = {
      fetchPage: jest.fn().mockReturnValue(Promise.resolve()),
      fetchPageBlocks: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const wrapper = render(props);

    await Promise.resolve();
    await Promise.resolve();

    const form = wrapper.find(Formik).dive();

    expect(form).toMatchSnapshot();
  });

  it('should fetch list', async () => {
    jest.spyOn(defaultProps, 'fetchPage');
    jest.spyOn(defaultProps, 'fetchPageBlocks');
    render();
    await Promise.resolve();
    await Promise.resolve();
    expect(defaultProps.fetchPage).toBeCalledWith({ pageId: '1' });
    expect(defaultProps.fetchPageBlocks).toBeCalledWith({ pageId: '1' });
  });

  it('should go to page list page', async () => {
    const props = {
      fetchPage: jest.fn().mockReturnValue(Promise.resolve()),
      fetchPageBlocks: jest.fn().mockReturnValue(Promise.resolve()),
    };
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render(props);
    await Promise.resolve();
    await Promise.resolve();
    wrapper.find(BackArrowButton).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/folder/1');
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
      fetchPageBlocks: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const wrapper = render(props);
    await Promise.resolve();
    await Promise.resolve();
    const link = wrapper.find(Link).at(1);

    expect(link.props('to').to).toBe('/block/2');
  });
});
