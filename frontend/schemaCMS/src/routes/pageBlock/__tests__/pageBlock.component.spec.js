import React from 'react';
import { shallow } from 'enzyme';

import { PageBlock } from '../pageBlock.component';
import { defaultProps } from '../pageBlock.stories';
import { Form } from '../pageBlock.styles';

describe('PageBlock: Component', () => {
  const component = props => <PageBlock {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const props = {
      fetchPageBlock: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const wrapper = render(props);
    await Promise.resolve();
    expect(wrapper).toMatchSnapshot();
  });

  it('should back to list', async () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render();
    wrapper.find('#backBtn').simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/page/1');
  });

  it('should submit form', () => {
    jest.spyOn(defaultProps, 'handleSubmit');
    const wrapper = render();
    wrapper.find(Form).simulate('submit');

    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });

  it('should call removePageBlock on confirm button click', () => {
    jest.spyOn(defaultProps, 'removePageBlock');
    const wrapper = render();
    wrapper.find('#confirmRemovalBtn').simulate('click');

    expect(defaultProps.removePageBlock).toHaveBeenCalledWith({ pageId: 1, blockId: '1' });
  });
});
