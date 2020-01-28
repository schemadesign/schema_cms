import React from 'react';
import { shallow } from 'enzyme';
import { Form } from 'schemaUI';
import { reverse } from 'ramda';

import { PageBlockList } from '../pageBlockList.component';
import { Link } from '../pageBlockList.styles';
import { defaultProps, withOneBlock } from '../pageBlockList.stories';
import { BackArrowButton, PlusButton } from '../../../../shared/components/navigation';
import { Draggable } from '../../../../shared/components/draggable';
import { history } from '../../../../.storybook/helpers';

const { CheckboxGroup } = Form;

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

  it('should render correctly with one block', async () => {
    const props = {
      ...withOneBlock,
      fetchPage: jest.fn().mockReturnValue(Promise.resolve()),
      fetchPageBlocks: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const wrapper = render(props);
    await Promise.resolve();
    await Promise.resolve();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch list', async () => {
    jest.spyOn(defaultProps, 'fetchPage');
    jest.spyOn(defaultProps, 'fetchPageBlocks');
    jest.spyOn(defaultProps, 'saveTemporaryBlocks');
    render();
    await Promise.resolve();
    await Promise.resolve();
    expect(defaultProps.fetchPage).toBeCalledWith({ pageId: '1' });
    expect(defaultProps.fetchPageBlocks).toBeCalledWith({ pageId: '1' });
    expect(defaultProps.saveTemporaryBlocks).not.toBeCalled();
  });

  it('should call saveTemporaryBlocks', async () => {
    jest.spyOn(defaultProps, 'saveTemporaryBlocks');
    jest.spyOn(defaultProps, 'setValues');
    const props = {
      history: { ...history, location: { state: { fromBlock: true } } },
      temporaryPageBlocks: [{ id: 1 }],
    };
    render(props);
    await Promise.resolve();
    await Promise.resolve();
    expect(defaultProps.setValues).toBeCalledWith(props.temporaryPageBlocks);
    expect(defaultProps.saveTemporaryBlocks).toBeCalledWith([]);
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
    jest.spyOn(defaultProps, 'saveTemporaryBlocks');
    const wrapper = render();
    wrapper.find(PlusButton).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/page/1/block/create');
    expect(defaultProps.saveTemporaryBlocks).not.toBeCalledWith(defaultProps.values);
  });

  it('should go to create block and save temporary blocks', () => {
    jest.spyOn(defaultProps.history, 'push');
    jest.spyOn(defaultProps, 'saveTemporaryBlocks');
    const wrapper = render({ dirty: true });
    wrapper.find(PlusButton).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/page/1/block/create');
    expect(defaultProps.saveTemporaryBlocks).toBeCalledWith(defaultProps.values);
  });

  it('should have link to block', async () => {
    jest.spyOn(defaultProps, 'saveTemporaryBlocks');
    const props = {
      fetchPage: jest.fn().mockReturnValue(Promise.resolve()),
      fetchPageBlocks: jest.fn().mockReturnValue(Promise.resolve()),
      dirty: true,
    };
    const wrapper = render(props);
    await Promise.resolve();
    await Promise.resolve();

    const link = wrapper
      .find(Draggable)
      .at(1)
      .dive()
      .find(Link);
    link.simulate('click');

    expect(link.props('to').to).toBe('/block/2');
    expect(defaultProps.saveTemporaryBlocks).toBeCalledWith(defaultProps.values);
  });

  it('should change order of values', async () => {
    jest.spyOn(defaultProps, 'setValues');

    const wrapper = render();
    await Promise.resolve();
    await Promise.resolve();

    wrapper
      .find(Draggable)
      .first()
      .prop('onMove')(0, 1);

    expect(defaultProps.setValues).toBeCalledWith(reverse(defaultProps.values));
  });

  it('should change active state', async () => {
    jest.spyOn(defaultProps, 'setValues');

    const e = { target: { checked: true, value: '2' } };
    const wrapper = render();
    await Promise.resolve();
    await Promise.resolve();

    wrapper
      .find(CheckboxGroup)
      .first()
      .prop('onChange')(e);

    expect(defaultProps.setValues).toBeCalledWith([
      { id: 1, isActive: true, name: 'block 1' },
      { id: 2, isActive: true, name: 'block 2' },
    ]);
  });
});
